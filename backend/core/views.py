from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Q
from django.utils import timezone
from .models import UserProfile, RetailerProfile, DueEntry
from .serializers import UserProfileSerializer, DueEntrySerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    try:
        # Create User
        user_data = request.data.get('user', {})
        user = User.objects.create_user(
            username=user_data.get('email'),
            email=user_data.get('email'),
            password=user_data.get('password'),
            first_name=user_data.get('first_name', '')
        )
        
        # Create UserProfile
        profile = UserProfile.objects.create(
            user=user,
            user_type=request.data.get('user_type').lower(),
            business_name=request.data.get('business_name'),
            phone=request.data.get('phone'),
            gst_number=request.data.get('gst_number'),
            address=request.data.get('address', '')
        )
        
        # Create RetailerProfile if user is a retailer
        if request.data.get('user_type').lower() == 'retailer':
            retailer_data = request.data.get('retailer_profile', {})
            RetailerProfile.objects.create(
                user_profile=profile,
                pan_number=retailer_data.get('pan_number'),
                annual_turnover=retailer_data.get('annual_turnover'),
                years_in_business=retailer_data.get('years_in_business'),
                business_type=retailer_data.get('business_type'),
                shop_ownership=retailer_data.get('shop_ownership'),
                existing_bank_account=retailer_data.get('existing_bank_account', False)
            )
        
        # Log the user in
        login(request, user)
        
        return Response({
            'user': UserProfileSerializer(profile).data,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # If any error occurs, cleanup created user if it exists
        if 'user' in locals():
            user.delete()
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=email, password=password)
    if user is not None:
        login(request, user)
        profile = UserProfile.objects.get(user=user)
        return Response({
            'user': UserProfileSerializer(profile).data,
            'message': 'Login successful'
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return UserProfile.objects.filter(user=self.request.user)
        return UserProfile.objects.all()

class RetailerViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user_type='retailer')
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if len(query) < 3:
            return Response([])
        
        retailers = UserProfile.objects.filter(
            user_type='retailer'
        ).filter(
            Q(phone__icontains=query) |
            Q(business_name__icontains=query)
        )[:10]
        
        return Response(UserProfileSerializer(retailers, many=True).data)

class DueEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DueEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.userprofile
        if user_profile.user_type == 'supplier':
            return DueEntry.objects.filter(supplier=user_profile)
        return DueEntry.objects.filter(retailer=user_profile)

    def perform_create(self, serializer):
        user_profile = self.request.user.userprofile
        if user_profile.user_type != 'supplier':
            raise serializers.ValidationError("Only suppliers can create due entries")
        
        retailer_id = self.request.data.get('retailer')
        try:
            retailer = UserProfile.objects.get(id=retailer_id, user_type='retailer')
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("Invalid retailer selected")
        
        serializer.save(
            supplier=user_profile,
            retailer=retailer,
            status='pending'
        )

    @action(detail=False, methods=['get'])
    def summary(self, request):
        user_profile = request.user.userprofile
        if user_profile.user_type != 'supplier':
            return Response({"error": "Only suppliers can view summary"}, status=400)
        
        total_outstanding = DueEntry.objects.filter(
            supplier=user_profile,
            status='pending'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        due_today = DueEntry.objects.filter(
            supplier=user_profile,
            status='pending',
            due_date=timezone.now().date()
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        total_retailers = UserProfile.objects.filter(
            received_dues__supplier=user_profile
        ).distinct().count()
        
        return Response({
            'total_outstanding': total_outstanding,
            'due_today': due_today,
            'total_retailers': total_retailers
        })

class DueEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DueEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.userprofile
        if user_profile.user_type == 'supplier':
            return DueEntry.objects.filter(supplier=user_profile)
        return DueEntry.objects.filter(retailer=user_profile)

    def perform_create(self, serializer):
        user_profile = self.request.user.userprofile
        if user_profile.user_type != 'supplier':
            raise serializers.ValidationError("Only suppliers can create due entries")
        
        retailer_id = self.request.data.get('retailer')
        try:
            retailer = UserProfile.objects.get(id=retailer_id, user_type='retailer')
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("Invalid retailer selected")
        
        serializer.save(
            supplier=user_profile,
            retailer=retailer,
            status='pending'
        )

    @action(detail=False, methods=['get'])
    def summary(self, request):
        user_profile = request.user.userprofile
        if user_profile.user_type != 'supplier':
            return Response({"error": "Only suppliers can view summary"}, status=400)

        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)
        last_month_start = (first_day_of_month - datetime.timedelta(days=1)).replace(day=1)
        
        # Calculate total outstanding
        total_outstanding = DueEntry.objects.filter(
            supplier=user_profile,
            status='pending'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate due today
        due_today = DueEntry.objects.filter(
            supplier=user_profile,
            status='pending',
            due_date=today
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate overdue amount
        overdue_amount = DueEntry.objects.filter(
            supplier=user_profile,
            status='pending',
            due_date__lt=today
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate this month's collection
        this_month_collection = DueEntry.objects.filter(
            supplier=user_profile,
            status='paid',
            updated_at__gte=first_day_of_month
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate last month's collection
        last_month_collection = DueEntry.objects.filter(
            supplier=user_profile,
            status='paid',
            updated_at__gte=last_month_start,
            updated_at__lt=first_day_of_month
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Get total number of retailers
        total_retailers = UserProfile.objects.filter(
            received_dues__supplier=user_profile
        ).distinct().count()

        return Response({
            'totalOutstanding': total_outstanding,
            'dueToday': due_today,
            'totalRetailers': total_retailers,
            'overdueAmount': overdue_amount,
            'thisMonthCollection': this_month_collection,
            'lastMonthCollection': last_month_collection
        })