from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import recent_activities

urlpatterns = [
    path('recent/', recent_activities, name='recent-activities'),
]