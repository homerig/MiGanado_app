from rest_framework import serializers
from .models import Usuario, Lote, Animal, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones

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
        fields = '__all__'

class TratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamiento
        fields = '__all__'

class SangradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sangrado
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class ConfigNotificacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfigNotificaciones
        fields = '__all__'
