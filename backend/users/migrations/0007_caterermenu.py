# Generated by Django 5.0.3 on 2024-08-13 06:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_canteenfoodmenu_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='CatererMenu',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valid_from', models.DateField()),
                ('caterer_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.caterer')),
                ('food_menu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.canteenfoodmenu')),
            ],
        ),
    ]
