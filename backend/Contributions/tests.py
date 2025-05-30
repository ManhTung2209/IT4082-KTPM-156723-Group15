from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('contributions/list/', views.contribution_list, name='contribution-list'),
    path('contributions/create/', views.contribution_create, name='contribution-create'),
    path('contributions/<int:pk>/', views.contribution_detail, name='contribution-detail'),
    path('contributions/<int:pk>/update/', views.contribution_update, name='contribution-update'),
    path('contributions/<int:pk>/partial-update/', views.contribution_partial_update, name='contribution-partial-update'),
    path('contributions/<int:pk>/delete/', views.contribution_delete, name='contribution-delete'),
    
    path('contributions/status-check/', views.contribution_status_check, name='contribution_status_check'),  
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]