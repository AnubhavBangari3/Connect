# Generated by Django 4.2.2 on 2023-07-04 15:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0019_plan"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="plan",
            name="fiveYear",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="fiveYearEdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="fiveYearSdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="oneYear",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="oneYearEdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="oneYearSdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="sixMonth",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="sixMonthEdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="sixMonthSdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="tenYear",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="tenYearEdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="threeYear",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="threeYearEdt",
        ),
        migrations.RemoveField(
            model_name="plan",
            name="threeYearSdt",
        ),
    ]
