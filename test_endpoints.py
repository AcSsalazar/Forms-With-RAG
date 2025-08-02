#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.utils.text import slugify
from forms.models import Form
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

def test_endpoints():
    # Verificar formularios existentes
    forms = Form.objects.all()
    print("Formularios existentes:")
    for form in forms:
        print(f"  - {form.title} -> slug: {form.slug}")

    # Crear un usuario de prueba (solo si tuvieras autenticación obligatoria)
    user, created = User.objects.get_or_create(
        document='12345678',
        defaults={'email': 'test@example.com', 'full_name': 'Test User'}
    )
    print("DEBUG =", settings.DEBUG)
    print("ALLOWED_HOSTS =", settings.ALLOWED_HOSTS)

    # Usar Client para simular request HTTP completo
    client = Client()

    # Probar cada formulario dinámicamente
    for form in forms:
        slug = form.slug
        print(f"\nProbando endpoint /api/forms/form/{slug}/")
        url = f"/api/forms/form/{slug}/"

        response = client.get(url)
        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            print("✅ Endpoint funciona correctamente")
            content_type = response.get('Content-Type', 'No especificado')
            print(f"Content type: {content_type}")
            print(f"Content preview: {response.content[:200]}...")
        else:
            print("❌ Endpoint no funciona")
            print(f"Response content: {response.content.decode('utf-8')}")

if __name__ == '__main__':
    test_endpoints()
