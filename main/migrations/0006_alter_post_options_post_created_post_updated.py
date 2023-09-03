# Generated by Django 4.1.5 on 2023-06-11 06:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0005_profile_access_token"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="post",
            options={"ordering": ["-created"]},
        ),
        migrations.AddField(
            model_name="post",
            name="created",
            field=models.DateTimeField(auto_now_add=True, default="2023-06-11"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="post",
            name="updated",
            field=models.DateTimeField(auto_now_add=True, default="2023-06-11"),
            preserve_default=False,
        ),
    ]
