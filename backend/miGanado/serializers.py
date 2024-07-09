from rest_framework import serializers
from .models import Usuario, Lote, Animal, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones,Tacto

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = '__all__'

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'lotes', 'numeroCaravana', 'tipos', 'peso', 'edad', 'isNewborn', 'isPregnant', 'userId']

class TratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamiento
        fields = ['id', 'numeroCaravana', 'tratamiento' , 'medicacion', 'fechaInicio', 'cada', 'userId' ]

class SangradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sangrado
        fields = ['id', 'numero_lote', 'numero_animal', 'numero_tubo', 'fecha', 'userId']
        
class TactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tacto
        fields= ['id', 'numero_lote', 'numero_animal', 'fecha', 'userId','prenada']


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class ConfigNotificacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigNotificaciones
        fields = '__all__'
