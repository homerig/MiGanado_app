from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View

from .models import Usuario, Lote, Animal, Tratamiento, Sangrado, Notificacion, ConfigNotificaciones, Tacto,Vacunacion
from .serializers import UsuarioSerializer, LoteSerializer, AnimalSerializer, TratamientoSerializer, SangradoSerializer, NotificacionSerializer, ConfigNotificacionesSerializer,TactoSerializer, VacunacionSerializer

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

class BuscarAnimalView(APIView):
    def post(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        numCaravana = request.data.get('numeroCaravana')

        try:
            animal = Animal.objects.get(numeroCaravana=numCaravana, userId=idUsuario)
            serializer = AnimalSerializer(animal)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Animal.DoesNotExist:
            return Response({'message': 'Animal no encontrado'})
        
class UserNotificationsView(APIView):
    def get(self, request, user_id):
        notificaciones = Notificacion.objects.filter(userId=user_id)
        notificaciones_data = list(notificaciones.values('tipo', 'mensaje', 'fecha', 'id'))
        return JsonResponse(notificaciones_data, safe=False)
    
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

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class LoteViewSet(viewsets.ModelViewSet):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class TratamientoViewSet(viewsets.ModelViewSet):
    queryset = Tratamiento.objects.all()
    serializer_class = TratamientoSerializer

class SangradoViewSet(viewsets.ModelViewSet):
    queryset = Sangrado.objects.all()
    serializer_class = SangradoSerializer

class TactoViewSet(viewsets.ModelViewSet):
    queryset=Tacto.objects.all()
    serializer_class = TactoSerializer

class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

class ConfigNotificacionesViewSet(viewsets.ModelViewSet):
    queryset = ConfigNotificaciones.objects.all()
    serializer_class = ConfigNotificacionesSerializer

class VacunacionViewSet(viewsets.ModelViewSet):
    queryset = Vacunacion.objects.all()
    serializer_class=VacunacionSerializer
