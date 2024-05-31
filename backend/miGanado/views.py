from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from .models import Ganado  # Importa tu modelo de datos

class GanadoViewSet(viewsets.ViewSet):
    renderer_classes = [JSONRenderer]

    def list(self, request):
        # Obtiene los datos de la base de datos o de otra fuente
        queryset = Ganado.objects.all()  # Suponiendo que Ganado es tu modelo de datos
        data = [{'id': item.id, 'name': item.name} for item in queryset]  # Serializa los datos a JSON

        return Response(data)
