from rest_framework import serializers
from .models import Ganado

class GanadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ganado
        fields = '__all__'
