from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GanadoViewSet

router = DefaultRouter()
router.register(r'ganado', GanadoViewSet, basename='ganado')  # Especifica el basename aquí

urlpatterns = [
    path('', include(router.urls)),
]
