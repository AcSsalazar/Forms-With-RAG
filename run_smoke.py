#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from forms.models import Form

def run_smoke():
    client = Client()
    forms = Form.objects.all()
    print(f"Found {forms.count()} forms")
    for form in forms:
        slug = form.slug
        url = f"/api/forms/form/{slug}/"
        try:
            resp = client.get(url)
            print(f"{url} -> {resp.status_code} | Content-Type: {resp.get('Content-Type', 'N/A')}")
            if resp.status_code != 200:
                print(resp.content.decode('utf-8'))
        except Exception as e:
            print(f"Error requesting {url}: {e}")

if __name__ == '__main__':
    run_smoke()
