# Generated by Django 4.2.2 on 2023-07-03 15:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0018_lifebook"),
    ]

    operations = [
        migrations.CreateModel(
            name="Plan",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("oneMonth", models.BooleanField()),
                ("oneMonthSdt", models.DateTimeField()),
                ("oneMonthEdt", models.DateTimeField()),
                ("sixMonth", models.BooleanField()),
                ("sixMonthSdt", models.DateTimeField()),
                ("sixMonthEdt", models.DateTimeField()),
                ("oneYear", models.BooleanField()),
                ("oneYearSdt", models.DateTimeField()),
                ("oneYearEdt", models.DateTimeField()),
                ("threeYear", models.BooleanField()),
                ("threeYearSdt", models.DateTimeField()),
                ("threeYearEdt", models.DateTimeField()),
                ("fiveYear", models.BooleanField()),
                ("fiveYearSdt", models.DateTimeField()),
                ("fiveYearEdt", models.DateTimeField()),
                ("tenYear", models.BooleanField()),
                ("tenYearEdt", models.DateTimeField()),
                (
                    "current_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="current_LP",
                        to="main.lifebook",
                    ),
                ),
                (
                    "prof",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prof_user",
                        to="main.profile",
                    ),
                ),
            ],
        ),
    ]
