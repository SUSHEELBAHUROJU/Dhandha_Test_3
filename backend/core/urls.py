from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from .views import (
    UserProfileViewSet,
    RetailerViewSet,
    DueEntryViewSet,
    health_check,
    login_view,
    logout_view,
    register_view
)

router = DefaultRouter()
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'retailers', RetailerViewSet, basename='retailers')
router.register(r'dues', DueEntryViewSet, basename='dues')

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

urlpatterns = [
    path('', include(router.urls)),
    path('csrf/', get_csrf_token, name='csrf'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path('health/', health_check, name='health_check'),
]