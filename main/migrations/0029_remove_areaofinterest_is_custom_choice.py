# Generated by Django 4.2.2 on 2023-07-27 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0028_remove_areaofinterest_suggestion"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="areaofinterest",
            name="is_custom_choice",
        ),
    ]
