from rest_framework import serializers
from .models import Usuario, Lote, Animal, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones,Tacto, Vacunacion

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = ['id','usuario','numero','capacidad','capacidad_max','tipo_animal','animales']

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'numeroCaravana', 'numero_lote', 'tipos', 'peso', 'edad', 'preniada', 'reciennacida', 'userId']

class TratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamiento
        fields = ['id', 'numeroCaravana', 'tratamiento' , 'medicacion', 'fechaInicio', 'cada', 'durante', 'userId' ]

class SangradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sangrado
        fields = ['id', 'numero_lote', 'numeroCaravana','numero_tubo', 'fecha', 'userId']
        
class TactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tacto
        fields= ['id', 'numero_lote', 'numeroCaravana', 'fecha', 'prenada','userId']


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class ConfigNotificacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigNotificaciones
        fields = '__all__'

class VacunacionSerializer (serializers.ModelSerializer):
    class Meta:
        model = Vacunacion
        fields= ['id', 'numero_lote', 'nombre_vacuna', 'fechaInicio', 'durante','cada','userId']

