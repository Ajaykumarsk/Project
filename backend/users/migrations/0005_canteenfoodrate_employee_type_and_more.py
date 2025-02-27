# Generated by Django 5.0.3 on 2024-08-05 06:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_rename_cateen_item_name_canteenfoodrate_canteen_item_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='canteenfoodrate',
            name='employee_type',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='users.employeetype'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='canteenfoodrate',
            name='caterer_name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.caterer'),
        ),
    ]
