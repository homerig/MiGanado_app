# Generated by Django 5.0.6 on 2024-06-26 18:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('miGanado', '0002_animal_confignotificaciones_historialmedico_lote_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='animal',
            old_name='numeroCaravana',
            new_name='numero_caravana',
        ),
        migrations.RenameField(
            model_name='historialmedico',
            old_name='fechaFallecimiento',
            new_name='fecha_fallecimiento',
        ),
        migrations.RenameField(
            model_name='historialmedico',
            old_name='fechaNacimiento',
            new_name='fecha_nacimiento',
        ),
        migrations.RenameField(
            model_name='lote',
            old_name='capacidadMax',
            new_name='capacidad_max',
        ),
        migrations.RenameField(
            model_name='notificacion',
            old_name='IdTipo',
            new_name='tipo',
        ),
        migrations.RenameField(
            model_name='sangrado',
            old_name='numeroAnimal',
            new_name='numero_animal',
        ),
        migrations.RenameField(
            model_name='sangrado',
            old_name='numeroLote',
            new_name='numero_lote',
        ),
        migrations.RenameField(
            model_name='sangrado',
            old_name='numeroTubo',
            new_name='numero_tubo',
        ),
        migrations.RenameField(
            model_name='tratamiento',
            old_name='fechaInicio',
            new_name='fecha_inicio',
        ),
        migrations.RenameField(
            model_name='usuario',
            old_name='correoElectronico',
            new_name='correo_electronico',
        ),
        migrations.RenameField(
            model_name='usuario',
            old_name='nombreCampo',
            new_name='nombre_campo',
        ),
        migrations.RenameField(
            model_name='usuario',
            old_name='idTipo',
            new_name='tipo',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='HistorialMedico',
        ),
        migrations.RemoveField(
            model_name='confignotificaciones',
            name='usuario_config',
        ),
        migrations.RemoveField(
            model_name='historialmedico',
            name='sangrado',
        ),
        migrations.RemoveField(
            model_name='lote',
            name='Animales',
        ),
        migrations.RemoveField(
            model_name='lote',
            name='idTipoAnimal',
        ),
        migrations.RemoveField(
            model_name='tratamiento',
            name='numeroAnimal',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='configNotificaciones',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='lotes',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='notificaciones',
        ),
        migrations.AddField(
            model_name='animal',
            name='historial_medico',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='animal_asociado', to='miGanado.historialmedico'),
        ),
        migrations.AddField(
            model_name='animal',
            name='lote',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='animales_asociados', to='miGanado.lote'),
        ),
        migrations.AddField(
            model_name='confignotificaciones',
            name='usuario',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='config_notificaciones', to='miGanado.usuario'),
        ),
        migrations.AddField(
            model_name='historialmedico',
            name='sangrados',
            field=models.ManyToManyField(blank=True, default=1, related_name='historiales_medicos', to='miGanado.sangrado'),
        ),
        migrations.AddField(
            model_name='lote',
            name='tipo_animal',
            field=models.CharField(choices=[('toro', 'Toro'), ('vaca', 'Vaca')], default='toro', max_length=20),
        ),
        migrations.AddField(
            model_name='lote',
            name='usuario',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='lotes', to='miGanado.usuario'),
        ),
        migrations.AddField(
            model_name='notificacion',
            name='usuario',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='notificaciones', to='miGanado.usuario'),
        ),
        migrations.AddField(
            model_name='sangrado',
            name='historial_medico',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='sangrados_asociados', to='miGanado.historialmedico'),
        ),
        migrations.AddField(
            model_name='tratamiento',
            name='historial_medico',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='tratamientos_asociados', to='miGanado.historialmedico'),
        ),
        migrations.AlterField(
            model_name='historialmedico',
            name='tratamientos',
            field=models.ManyToManyField(blank=True, default=1, related_name='historiales_medicos', to='miGanado.tratamiento'),
        ),
        migrations.AddField(
            model_name='lote',
            name='animales',
            field=models.ManyToManyField(blank=True, default=1, related_name='lotes_asociados', to='miGanado.animal'),
        ),
    ]
