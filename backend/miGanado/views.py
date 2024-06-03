from rest_framework import viewsets
from rest_framework.response import Response
from .models import Usuario, Lote, Animal, HistorialMedico, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones
from .serializers import UsuarioSerializer, LoteSerializer, AnimalSerializer, HistorialMedicoSerializer, TratamientoSerializer, SangradoSerializer, NotificacionSerializer, ConfigNotificacionesSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class LoteViewSet(viewsets.ModelViewSet):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class HistorialMedicoViewSet(viewsets.ModelViewSet):
    queryset = HistorialMedico.objects.all()
    serializer_class = HistorialMedicoSerializer

class TratamientoViewSet(viewsets.ModelViewSet):
    queryset = Tratamiento.objects.all()
    serializer_class = TratamientoSerializer

class SangradoViewSet(viewsets.ModelViewSet):
    queryset = Sangrado.objects.all()
    serializer_class = SangradoSerializer

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

class ConfigNotificacionesViewSet(viewsets.ModelViewSet):
    queryset = ConfigNotificaciones.objects.all()
    serializer_class = ConfigNotificacionesSerializer
