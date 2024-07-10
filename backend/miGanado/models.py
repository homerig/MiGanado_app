from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Usuario(models.Model):
    TIPO_CHOICES = [
        ('cliente', 'Cliente'),
        ('admin', 'Administrador'),
    ]
    
    nombre = models.CharField(max_length=100)
    nombre_campo = models.CharField(max_length=100)
    correo_electronico = models.EmailField()
    contrasenia = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)

class Lote(models.Model):
    TIPO_CHOICES = [
        ('toro', 'Toro'),
        ('vaca', 'Vaca'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='lotes', default=1)
    numero = models.IntegerField()
    capacidad = models.IntegerField()
    capacidad_max = models.IntegerField()
    tipo_animal = models.CharField(max_length=20, choices=TIPO_CHOICES, default='toro')
    animales = models.ManyToManyField('Animal', blank=True, related_name='lotes_asociados', default=1)

class HistorialMedico(models.Model):
    peso = models.FloatField()
    fecha_nacimiento = models.DateField()
    fecha_fallecimiento = models.DateField(null=True, blank=True)
    preniada = models.BooleanField()
    tratamientos = models.ManyToManyField('Tratamiento', blank=True, related_name='historiales_medicos', default=1)
    sangrados = models.ManyToManyField('Sangrado', blank=True, related_name='historiales_medicos', default=1)

class Animal(models.Model):
    lote = models.ForeignKey(Lote, on_delete=models.CASCADE, related_name='animales_asociados', default=1)
    numero_caravana = models.CharField(max_length=100)
    raza = models.CharField(max_length=100)
    historial_medico = models.OneToOneField(HistorialMedico, on_delete=models.CASCADE, related_name='animal_asociado', default=1)

class Tratamiento(models.Model):
    TIPO_CHOICES = [
        ('tratamiento', 'Tratamiento'),
        ('vacunacion', 'Vacunación'),
    ]
    
    historial_medico = models.ForeignKey(HistorialMedico, on_delete=models.CASCADE, related_name='tratamientos_asociados', default=1)
    nombre = models.CharField(max_length=100)
    medicacion = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    duracion = models.IntegerField()
    repeticion = models.IntegerField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)

class Sangrado(models.Model):    
    historial_medico = models.ForeignKey(HistorialMedico, on_delete=models.CASCADE, related_name='sangrados_asociados', default=1)
    numero_lote = models.IntegerField()
    numero_animal = models.IntegerField()
    numero_tubo = models.IntegerField()
    fecha = models.DateField()

class Notificacion(models.Model):
    TIPO_CHOICES = [
        ('lote', 'Lote'),
        ('tratamiento', 'Tratamiento'),
        ('tacto', 'Tacto'),
        ('sangrado', 'Sangrado'),
        ('estadisticas', 'Estadísticas'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)  # Añade la relación de usuario
    IdTipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    mensaje = models.CharField(max_length=255)
    fecha = models.DateTimeField(auto_now_add=True)  # auto_now_add para la fecha de creación

    def __str__(self):
        return f"{self.get_IdTipo_display()} - {self.mensaje}"

class ConfigNotificaciones(models.Model):    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='config_notificaciones', default=1)
    recibir_notificaciones_lote = models.BooleanField(default=False)
    recibir_notificaciones_tratamiento = models.BooleanField(default=False)
    recibir_notificaciones_tacto = models.BooleanField(default=False)
    recibir_notificaciones_sangrado = models.BooleanField(default=False)
    recibir_notificaciones_estadisticas = models.BooleanField(default=False)

    def __str__(self):
        return f"Preferencias de notificación para {self.usuario_config.username}"

