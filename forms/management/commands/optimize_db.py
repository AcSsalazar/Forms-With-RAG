from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Optimize SQLite database'

    def handle(self, *args, **kwargs):
        self.stdout.write('Running VACUUM command...')
        with connection.cursor() as cursor:
            cursor.execute("VACUUM")
        self.stdout.write(self.style.SUCCESS('VACUUM command executed successfully.'))

        self.stdout.write('Running ANALYZE command...')
        with connection.cursor() as cursor:
            cursor.execute("ANALYZE")
        self.stdout.write(self.style.SUCCESS('ANALYZE command executed successfully.'))