# Generated by Django 5.0.6 on 2024-07-14 18:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('miGanado', '0008_remove_sangrado_numero_animal_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tacto',
            old_name='numero_animal',
            new_name='numeroCaravana',
        ),
    ]
