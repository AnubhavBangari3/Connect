# Generated by Django 4.1.5 on 2023-06-11 06:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0010_alter_post_options_remove_post_created_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="profile",
            name="created",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="updated",
        ),
    ]