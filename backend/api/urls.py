from django.urls import path
from .views import producto_view

urlpatterns = [
    path('producto/', producto_view, name='producto_api'),
]
