from django.core.validators import RegexValidator
from django.db import migrations, models


numero_caravana_validator = RegexValidator(
    regex=r'^\d{1,15}$',
    message='El numero de caravana debe contener solo numeros y hasta 15 digitos.',
)


class Migration(migrations.Migration):

    dependencies = [
        ('miGanado', '0002_alter_tacto_numerocaravana'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='numeroCaravana',
            field=models.CharField(max_length=15, validators=[numero_caravana_validator]),
        ),
        migrations.AlterField(
            model_name='sangrado',
            name='numeroCaravana',
            field=models.CharField(max_length=15, validators=[numero_caravana_validator]),
        ),
        migrations.AlterField(
            model_name='tacto',
            name='numeroCaravana',
            field=models.CharField(max_length=15, validators=[numero_caravana_validator]),
        ),
        migrations.AlterField(
            model_name='tratamiento',
            name='numeroCaravana',
            field=models.CharField(max_length=15, validators=[numero_caravana_validator]),
        ),
    ]
