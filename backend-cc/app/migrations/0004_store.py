# Generated by Django 5.1.6 on 2025-03-12 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_user_password_alter_cart_cart_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Store',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_open', models.BooleanField(default=False)),
            ],
        ),
    ]
