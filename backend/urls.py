from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/forms/', include('forms.urls')),

    # ... cualquier otra ruta específica que necesites ...
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Asegúrate de que esta ruta esté al final de todas tus URL patterns
urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]