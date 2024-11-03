# Generated by Django 5.0.2 on 2024-11-02 15:41

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_dueentry'),
    ]

    operations = [
        migrations.AlterField(
            model_name='creditlimit',
            name='credit_score',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='retailerprofile',
            name='bank_statement_score',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='retailerprofile',
            name='credit_score',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(300), django.core.validators.MaxValueValidator(900)]),
        ),
        migrations.AlterField(
            model_name='retailerprofile',
            name='years_in_business',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
    ]