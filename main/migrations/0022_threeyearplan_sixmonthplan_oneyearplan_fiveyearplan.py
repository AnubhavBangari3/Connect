# Generated by Django 4.2.2 on 2023-07-09 09:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0021_alter_plan_onemonthedt_alter_plan_onemonthsdt"),
    ]

    operations = [
        migrations.CreateModel(
            name="ThreeYearPlan",
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
                ("tenyear", models.BooleanField()),
                ("tenYearSdt", models.DateField()),
                ("tenYearEdt", models.DateField()),
                (
                    "current_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="current_LP10y",
                        to="main.lifebook",
                    ),
                ),
                (
                    "prof",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prof_user10y",
                        to="main.profile",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SixMonthPlan",
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
                ("sixMonth", models.BooleanField()),
                ("sixMonthSdt", models.DateField()),
                ("sixMonthEdt", models.DateField()),
                (
                    "current_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="current_LP6",
                        to="main.lifebook",
                    ),
                ),
                (
                    "prof",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prof_user6",
                        to="main.profile",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="OneYearPlan",
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
                ("oneyear", models.BooleanField()),
                ("oneYearSdt", models.DateField()),
                ("oneYearEdt", models.DateField()),
                (
                    "current_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="current_LP1y",
                        to="main.lifebook",
                    ),
                ),
                (
                    "prof",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prof_user1y",
                        to="main.profile",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FiveYearPlan",
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
                ("fiveyear", models.BooleanField()),
                ("fiveYearSdt", models.DateField()),
                ("fiveYearEdt", models.DateField()),
                (
                    "current_plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="current_LP5y",
                        to="main.lifebook",
                    ),
                ),
                (
                    "prof",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prof_user5y",
                        to="main.profile",
                    ),
                ),
            ],
        ),
    ]
