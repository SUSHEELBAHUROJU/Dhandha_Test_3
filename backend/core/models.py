from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class UserProfile(models.Model):
    USER_TYPES = (
        ('supplier', 'Supplier'),
        ('retailer', 'Retailer'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    business_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    gst_number = models.CharField(max_length=15)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class RetailerProfile(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    pan_number = models.CharField(max_length=10)
    annual_turnover = models.DecimalField(max_digits=12, decimal_places=2)
    years_in_business = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    business_type = models.CharField(max_length=50)
    shop_ownership = models.CharField(max_length=20, choices=[('owned', 'Owned'), ('rented', 'Rented')])
    existing_bank_account = models.BooleanField(default=True)
    bank_statement_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    credit_score = models.IntegerField(validators=[MinValueValidator(300), MaxValueValidator(900)], null=True, blank=True)

class DueEntry(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    
    supplier = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='given_dues')
    retailer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_dues')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    purchase_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class CreditLimit(models.Model):
    retailer = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    total_limit = models.DecimalField(max_digits=10, decimal_places=2)
    available_limit = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)
    credit_score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    assessment_date = models.DateTimeField(auto_now_add=True)

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    supplier = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='supplied_transactions')
    retailer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField()

class Payment(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=10)
    reference_id = models.CharField(max_length=100)