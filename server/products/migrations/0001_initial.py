# Generated by Django 5.0.6 on 2024-05-10 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Product",
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
                ("img", models.CharField(max_length=9999)),
                ("brand", models.CharField(max_length=100)),
                ("title", models.CharField(max_length=150)),
                ("rating", models.FloatField()),
                ("price", models.IntegerField()),
                ("description", models.TextField()),
                ("category", models.CharField(max_length=100)),
                ("featured", models.BooleanField(default=False)),
            ],
        ),
    ]
