from django.urls import path, re_path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
from . import views

# Configuración del router de DRF
router = DefaultRouter()
router.register(r'forms', views.FormViewSet)
router.register(r'completed-forms', views.CompletedFormViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('completed-forms/check/<str:document_number>/', views.CheckDocumentView.as_view(), name='check-document'),
    path('completed-forms/<int:pk>/delete/', views.CompletedFormViewSet.as_view({'delete': 'delete_form'}), name='delete-form'),
    path('category-averages/<str:document_number>/', views.get_category_averages, name='category-averages'),
    
    # Endpoint dinámico para cualquier formulario por slug

    path('form/<slug:form_slug>/', views.FormBySlug.as_view(), name='form-by-slug'),
]