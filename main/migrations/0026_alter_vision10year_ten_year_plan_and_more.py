# Generated by Django 4.2.2 on 2023-07-20 15:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0025_vision10year_name_vision1month_name_vision1year_name_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="vision10year",
            name="ten_year_plan",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tenyearvision",
                to="main.tenyearplan",
            ),
        ),
        migrations.AlterField(
            model_name="vision1year",
            name="one_year_plan",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="oneyearvision",
                to="main.oneyearplan",
            ),
        ),
        migrations.AlterField(
            model_name="vision3year",
            name="three_year_plan",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="threeyearvision",
                to="main.threeyearplan",
            ),
        ),
        migrations.AlterField(
            model_name="vision5year",
            name="five_year_plan",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="fiveyearvision",
                to="main.fiveyearplan",
            ),
        ),
        migrations.AlterField(
            model_name="vision6month",
            name="six_month_plan",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sixmonthvision",
                to="main.sixmonthplan",
            ),
        ),
    ]
