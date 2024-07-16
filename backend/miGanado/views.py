import datetime
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Lote
from .serializers import LoteSerializer
from django.contrib.auth.hashers import check_password

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

class VerifyCurrentPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        current_password = request.data.get('current_password')  # Asegúrate de que el nombre de la variable sea correcto

        try:
            usuario = Usuario.objects.get(id=idUsuario)

            if current_password==usuario.contrasenia:
                return Response({'es_valido': True}, status=status.HTTP_200_OK)
            else:
                return Response({'es_valido': False})

        except Usuario.DoesNotExist:
            return Response({'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        
class BuscarAnimalLoteView(APIView):
    def post(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        numLote = request.data.get('numero_lote')

        try:
            # Filtrar los animales por número de lote y usuario
            animales = Animal.objects.filter(numero_lote=numLote, userId=idUsuario)
            
            # Serializar los animales encontrados
            serializer = AnimalSerializer(animales, many=True)
            
            # Retornar los datos serializados
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Animal.DoesNotExist:
            return Response({'message': 'Animales no encontrados'}, status=status.HTTP_404_NOT_FOUND)
class ActualizarNombreLoteView(APIView):
    def put(self, request, *args, **kwargs):
        lote_id = kwargs.get('lote_id')
        nombre_lote = request.data.get('nombre_lote')

        try:
            lote = Lote.objects.get(id=lote_id)                
            lote.nombre_lote = nombre_lote
            lote.save()                
            serializer = LoteSerializer(lote)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Lote.DoesNotExist:
            return Response({'message': 'Lote no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class ActualizarPreniesView(APIView):
    def put(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        numeroCaravana = request.data.get('numeroCaravana')
        preniada = request.data.get('preniada')

        try:
            animal = Animal.objects.get(numeroCaravana=numeroCaravana, userId=idUsuario)
            animal.preniada = preniada
            animal.save()
            serializer = AnimalSerializer(animal)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Animal.DoesNotExist:
            return Response({'message': 'Animal no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ActualizarContrasenaView(APIView):
    def put(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        nueva_contrasena = request.data.get('nueva_contrasena')

        try:
            usuario = Usuario.objects.get(id=idUsuario)
            usuario.contrasenia = nueva_contrasena  # Asegúrate de usar hashers para la contraseña
            usuario.save()
            return Response({'message': 'Contraseña actualizada con éxito'}, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ActualizarDetallesUsuarioView(APIView):
    def put(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        nuevo_nombre = request.data.get('nombre')
        nuevo_correo = request.data.get('correo_electronico')

        try:
            usuario = Usuario.objects.get(id=idUsuario)
            usuario.nombre = nuevo_nombre
            usuario.correo_electronico = nuevo_correo
            usuario.save()
            serializer = UsuarioSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ActualizarSangradoView(APIView):
    def put(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        numeroCaravana = request.data.get('numeroCaravana')
        numero_tubo = request.data.get('numero_tubo')

        try:
            sangrado = Sangrado.objects.get(numeroCaravana=numeroCaravana, userId=idUsuario)
            sangrado.numero_tubo = numero_tubo
            sangrado.save()
            serializer = SangradoSerializer(sangrado)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Sangrado.DoesNotExist:
            return Response({'message': 'sangrado no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class buscarTratamView(APIView):
    def post(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        numCaravana = request.data.get('numeroCaravana')

        try:
            tratamiento = Tratamiento.objects.get(numeroCaravana=numCaravana, userId=idUsuario)
            serializer = TratamientoSerializer(tratamiento)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Tratamiento.DoesNotExist:
            return Response({'message': 'tratamiento no encontrado'})

class buscarSanView(APIView):
    def post(self, request, *args, **kwargs):
        idUsuario = request.data.get('idUsuario')
        numCaravana = request.data.get('numeroCaravana')

        try:
            sangrado = Sangrado.objects.get(numeroCaravana=numCaravana, userId=idUsuario)
            serializer = SangradoSerializer(sangrado)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Sangrado.DoesNotExist:
            return Response({'message': 'sangrado no encontrado'})


class UserNotificationsView(APIView):
    def get(self, request, user_id):
        notificaciones = Notificacion.objects.filter(userId=user_id)
        notificaciones_data = list(notificaciones.values('tipo', 'mensaje', 'fecha', 'id'))
        return JsonResponse(notificaciones_data, safe=False)
    
class UserLotesView(viewsets.ModelViewSet):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer

    @action(detail=False, methods=['get'])
    def user_lotes(self, request, user_id=None):
        user_id = request.query_params.get('userId', None)
        if user_id is not None:
            lotes = Lote.objects.filter(usuario=user_id)
            serializer = self.get_serializer(lotes, many=True)
            return Response(serializer.data)
        return Response({"error": "User ID not provided"}, status=400)        

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

class EstadisticasView(APIView):
    def get(self, request, lote_id):
        try:
            # Verificar si el lote existe
            lote = Lote.objects.get(id=lote_id)

            # Calcular estadísticas
            total_animales = Animal.objects.filter(lote=lote).count()
            crias_mes = Animal.objects.filter(lote=lote, fecha_nacimiento__month=datetime.now().month).count()
            preniadas_mes = Animal.objects.filter(lote=lote, preniada=True).count()

            estadisticas = {
                'total_animales': total_animales,
                'crias_mes': crias_mes,
                'preniadas_mes': preniadas_mes,
            }

            return Response(estadisticas, status=status.HTTP_200_OK)
        except Lote.DoesNotExist:
            return Response({'message': 'Lote no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
