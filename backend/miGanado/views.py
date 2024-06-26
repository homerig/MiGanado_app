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
            usuario = Usuario.objects.get(correo_electronico=email)
            
            # Verificar si la contraseña coincide
            if usuario.contrasenia == password:
                # Contraseña válida, devolver un mensaje de inicio de sesión exitoso
                return Response({'id': usuario.id, 'message': 'Inicio de sesión exitoso'}, status=status.HTTP_200_OK)
            else:
                # Contraseña incorrecta
                return Response({'message': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuario.DoesNotExist:
            # No se encontró un usuario con el correo electrónico proporcionado
            return Response({'message': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class CrearLoteView(APIView):
    def post(self, request, *args, **kwargs):
        # Verifica la cantidad de lotes existentes
        cantidad_lotes = Lote.objects.count()
        
        if cantidad_lotes >= 4:
            return Response({'error': 'No se puede crear más de 4 lotes'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Si hay menos de 4 lotes, crea un nuevo lote
        serializer = LoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
