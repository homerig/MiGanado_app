from django.db import models

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


class Animal(models.Model):
    numero_lote = models.IntegerField()
    numeroCaravana = models.CharField(max_length=100)
    tipos = models.CharField(max_length=100)
    peso = models.FloatField(null=True, blank=True)
    edad = models.FloatField(null=True, blank=True)
    preniada = models.BooleanField(default=False)
    reciennacida = models.BooleanField(default=False)
    userId = models.IntegerField()
    tratamientos = models.ManyToManyField('Tratamiento')
    sangrado = models.ManyToManyField('Sangrado')

class Tratamiento(models.Model):
    numeroCaravana = models.CharField(max_length=100)
    tratamiento = models.CharField(max_length=100)
    medicacion = models.CharField(max_length=100)
    fechaInicio = models.DateField()
    cada = models.IntegerField()
    durante = models.IntegerField()
    userId = models.IntegerField()

class Sangrado(models.Model):
    numero_lote = models.IntegerField()
    numero_animal = models.IntegerField()
    numero_tubo = models.IntegerField()
    fecha = models.DateField()
    userId = models.IntegerField()

class Tacto(models.Model):
    numero_lote = models.IntegerField()
    numero_animal = models.IntegerField()
    prenada = models.BooleanField(default=False)
    fecha = models.DateField()
    userId = models.IntegerField()

    

class Notificacion(models.Model):
    TIPO_CHOICES = [
        ('lote', 'Lote'),
        ('tratamiento', 'Tratamiento'),
        ('tacto', 'Tacto'),
        ('sangrado', 'Sangrado'),
        ('estadísticas', 'Estadísticas'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones', default=1)  # Cambia 'default=1' al ID correcto
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    mensaje = models.CharField(max_length=255)
    fecha = models.DateTimeField()

class ConfigNotificaciones(models.Model):    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='config_notificaciones', default=1)
    recibir_notificaciones_lote = models.BooleanField(default=False)
    recibir_notificaciones_tratamiento = models.BooleanField(default=False)
    recibir_notificaciones_tacto = models.BooleanField(default=False)
    recibir_notificaciones_sangrado = models.BooleanField(default=False)
    recibir_notificaciones_estadisticas = models.BooleanField(default=False)
