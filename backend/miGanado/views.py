from rest_framework import viewsets
from rest_framework.response import Response
from .models import Ganado
from .serializers import GanadoSerializer  # Importa tu serializador

class GanadoViewSet(viewsets.ModelViewSet):
    queryset = Ganado.objects.all()  # Especifica el queryset para la vista
    serializer_class = GanadoSerializer  # Especifica el serializador para la vista
