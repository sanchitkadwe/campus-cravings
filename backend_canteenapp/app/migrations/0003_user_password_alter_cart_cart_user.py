# Generated by Django 5.1.6 on 2025-02-24 14:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_remove_cart_item_alter_payment_order_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default='password', max_length=10),
        ),
        migrations.AlterField(
            model_name='cart',
            name='cart_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='cart', to='app.user'),
        ),
    ]
