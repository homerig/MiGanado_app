from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, UsuarioViewSet, LoteViewSet, AnimalViewSet, TratamientoViewSet, SangradoViewSet, NotificacionViewSet, ConfigNotificacionesViewSet,TactoViewSet,VacunacionViewSet, UserNotificationsView

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
    path('user_notifications/<int:user_id>/', UserNotificationsView.as_view(), name='user_notifications'),
]
