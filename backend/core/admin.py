from django.contrib import admin
from .models import UserProfile, CreditLimit, Transaction, Payment

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'business_name', 'phone')
    list_filter = ('user_type',)
    search_fields = ('user__username', 'business_name', 'phone')

@admin.register(CreditLimit)
class CreditLimitAdmin(admin.ModelAdmin):
    list_display = ('retailer', 'total_limit', 'available_limit', 'last_updated')
    list_filter = ('last_updated',)
    search_fields = ('retailer__business_name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'retailer', 'amount', 'status', 'created_at', 'due_date')
    list_filter = ('status', 'created_at')
    search_fields = ('supplier__business_name', 'retailer__business_name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'amount', 'payment_date', 'status')
    list_filter = ('status', 'payment_date')
    search_fields = ('transaction__supplier__business_name', 'transaction__retailer__business_name')