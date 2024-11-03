from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, CreditLimit, Transaction, Payment, DueEntry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class DueEntrySerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.business_name', read_only=True)
    retailer_name = serializers.CharField(source='retailer.business_name', read_only=True)
    retailer_phone = serializers.CharField(source='retailer.phone', read_only=True)
    
    class Meta:
        model = DueEntry
        fields = '__all__'
        read_only_fields = ('supplier', 'status')

class CreditLimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditLimit
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    supplier = UserProfileSerializer(read_only=True)
    retailer = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'