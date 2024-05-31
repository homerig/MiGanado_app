from django.db import models

class Ganado(models.Model):
    nombre = models.CharField(max_length=100)
    raza = models.CharField(max_length=100)
    edad = models.IntegerField()

    def __str__(self):
        return self.nombre
