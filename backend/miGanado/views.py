from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate
from .models import Usuario, Lote, Animal, HistorialMedico, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones
from .serializers import UsuarioSerializer, LoteSerializer, AnimalSerializer, HistorialMedicoSerializer, TratamientoSerializer, SangradoSerializer, NotificacionSerializer, ConfigNotificacionesSerializer

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            # Buscar un usuario con el correo electrónico proporcionado
            usuario = Usuario.objects.get(correoElectronico=email)
            
            # Verificar si la contraseña coincide
            if usuario.contrasenia == password:
                # Contraseña válida, devolver un mensaje de inicio de sesión exitoso
                return Response({'message': 'Inicio de sesión exitoso'}, status=status.HTTP_200_OK)
            else:
                # Contraseña incorrecta
                return Response({'message': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuario.DoesNotExist:
            # No se encontró un usuario con el correo electrónico proporcionado
            return Response({'message': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

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
    permission_classes = [AllowAny] 

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ConfigNotificacionesViewSet(viewsets.ModelViewSet):
    queryset = ConfigNotificaciones.objects.all()
    serializer_class = ConfigNotificacionesSerializer
    permission_classes = [AllowAny] 

    def get_queryset(self):
        return self.queryset.filter(usuario_config=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario_config=self.request.user)
