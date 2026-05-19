#!/usr/bin/env python
import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from forms.models import Form

BASE = 'http://127.0.0.1:8000'
TIMEOUT = 5

def check(path):
    url = BASE + path
    try:
        r = requests.get(url, timeout=TIMEOUT)
        return r.status_code, r.headers.get('Content-Type', '')
    except Exception as e:
        return None, str(e)

def run():
    endpoints = ['/', '/admin/', '/api/']
    print('Checking basic endpoints:')
    for p in endpoints:
        status, info = check(p)
        print(f"{p} -> {status} | {info}")

    # static
    status, info = check('/static/')
    print(f"/static/ -> {status} | {info}")

    # forms via HTTP
    forms = Form.objects.all()
    print(f"Found {forms.count()} forms; checking each over HTTP:")
    for f in forms:
        path = f"/api/forms/form/{f.slug}/"
        status, info = check(path)
        print(f"{path} -> {status} | {info}")

if __name__ == '__main__':
    run()
