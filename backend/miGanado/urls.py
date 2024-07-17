from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AnimalDelete,actualizarAnimalView,VerifyCurrentPasswordView,ActualizarContrasenaView,ActualizarDetallesUsuarioView,EstadisticasView,ActualizarNombreLoteView,BuscarAnimalLoteView,ActualizarSangradoView ,UserLotesView,ActualizarPreniesView, buscarSanView,buscarTratamView, LoginView, UsuarioViewSet, BuscarAnimalView, LoteViewSet, AnimalViewSet, TratamientoViewSet, SangradoViewSet, NotificacionViewSet, ConfigNotificacionesViewSet,TactoViewSet,VacunacionViewSet, UserNotificationsView


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'lotes', LoteViewSet, basename='lote')
router.register(r'animales', AnimalViewSet, basename='animal')
router.register(r'tratamientos', TratamientoViewSet, basename='tratamiento')
router.register(r'sangrados', SangradoViewSet, basename='sangrado')
router.register(r'tactos', TactoViewSet, basename='tacto')
router.register(r'notificaciones', NotificacionViewSet, basename='notificacion')
router.register(r'confignotificaciones', ConfigNotificacionesViewSet, basename='confignotificacion')
router.register(r'vacunaciones', VacunacionViewSet, basename='vacunacion')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('buscarAnimal/', BuscarAnimalView.as_view(), name='buscarAnimal'),
    path('buscarAnimalLote/', BuscarAnimalLoteView.as_view(), name='buscarAnimalLote'),
    path('buscarTratam/', buscarTratamView.as_view(), name='buscarTratam'),
    path('buscarSan/', buscarSanView.as_view(), name='buscarSan'),
    path('actualizarPrenies/', ActualizarPreniesView.as_view(), name='actualizarPrenies'),
    path('actualizarAnimal/', actualizarAnimalView.as_view(), name='actualizarAnimal'),
    path('actualizarNombreLote/<int:lote_id>/', ActualizarNombreLoteView.as_view(), name='actualizarNombreLote'),
    path('actualizarSangrado/', ActualizarSangradoView.as_view(), name='actualizar_sangrado'),
    path('user_notifications/<int:user_id>/', UserNotificationsView.as_view(), name='user_notifications'),
    path('user_lotes/', UserLotesView.as_view({'get': 'user_lotes'}), name='user_lotes'),
    path('estadisticas/<int:lote_id>/', EstadisticasView.as_view(), name='estadisticas'),
    path('actualizarContrasena/', ActualizarContrasenaView.as_view(), name='actualizar_contrasena'),
    path('actualizarDetallesUsuario/', ActualizarDetallesUsuarioView.as_view(), name='actualizar_detalles_usuario'),
    path('verifyCurrentPassword/', VerifyCurrentPasswordView.as_view(), name='verify_current_password'),
    path('animal_delete/', AnimalDelete.as_view(), name='animal_delete'),
]

