# Generated by Django 5.0.3 on 2024-08-26 04:20

import users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_remove_caterermenu_food_menu_caterermenu_food_menu'),
    ]

    operations = [
        migrations.CreateModel(
            name='Circular',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('media', models.FileField(upload_to='media/', validators=[users.models.validate_file_type])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
