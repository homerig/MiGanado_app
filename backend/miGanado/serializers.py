from rest_framework import serializers
from .models import Usuario, Lote, Animal, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones,Tacto, Vacunacion


def validate_numero_caravana(value):
    if not value.isdigit() or len(value) > 15:
        raise serializers.ValidationError('El numero de caravana debe contener solo numeros y hasta 15 digitos.')
    return value

class UsuarioSerializer(serializers.ModelSerializer):
    def validate_correo_electronico(self, value):
        queryset = Usuario.objects.filter(correo_electronico__iexact=value)

        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Ya existe un usuario con ese correo electrónico.')

        return value

    class Meta:
        model = Usuario
        fields = '__all__'

class LoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lote
        fields = ['id','usuario','nombre_lote','numero','capacidad','capacidad_max','tipo_animal','animales']

class AnimalSerializer(serializers.ModelSerializer):
    def validate_numeroCaravana(self, value):
        return validate_numero_caravana(value)

    class Meta:
        model = Animal
        fields = ['id', 'numeroCaravana', 'numero_lote', 'tipos', 'peso', 'edad', 'preniada', 'reciennacida', 'userId']

class TratamientoSerializer(serializers.ModelSerializer):
    def validate_numeroCaravana(self, value):
        return validate_numero_caravana(value)

    class Meta:
        model = Tratamiento
        fields = ['id', 'numeroCaravana', 'tratamiento' , 'medicacion', 'fechaInicio', 'cada', 'durante', 'userId' ]

class SangradoSerializer(serializers.ModelSerializer):
    def validate_numeroCaravana(self, value):
        return validate_numero_caravana(value)

    class Meta:
        model = Sangrado
        fields = ['id', 'numero_lote', 'numeroCaravana','numero_tubo', 'fecha', 'userId']
        
class TactoSerializer(serializers.ModelSerializer):
    def validate_numeroCaravana(self, value):
        return validate_numero_caravana(value)

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
