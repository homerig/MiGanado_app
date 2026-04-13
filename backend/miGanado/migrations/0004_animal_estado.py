from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('miGanado', '0003_limit_numero_caravana_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='animal',
            name='estado',
            field=models.CharField(
                choices=[('vivo', 'Vivo'), ('murio', 'Murió'), ('vendido', 'Vendido')],
                default='vivo',
                max_length=20,
            ),
        ),
    ]
