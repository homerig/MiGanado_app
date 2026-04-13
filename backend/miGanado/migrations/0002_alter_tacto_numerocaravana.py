from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('miGanado', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tacto',
            name='numeroCaravana',
            field=models.CharField(max_length=100),
        ),
    ]
