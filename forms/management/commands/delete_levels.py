from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import transaction

class Command(BaseCommand):
    help = 'Elimina el campo levels dentro de category en answers dentro de content de todos los CompletedForms existentes'

    def handle(self, *args, **kwargs):
        CompletedForm = apps.get_model('forms', 'CompletedForm')

        with transaction.atomic():
            for completed_form in CompletedForm.objects.all():
                content = completed_form.content
                answers = content.get('answers', [])

                for answer in answers:
                    category = answer.get('category', None)
                    if category and 'levels' in category:
                        del category['levels']
                        self.stdout.write(self.style.SUCCESS(f"Removed 'levels' from category in CompletedForm ID {completed_form.id}"))

                # Actualizar el content del CompletedForm
                completed_form.content = content
                completed_form.save(update_fields=['content'])

        self.stdout.write(self.style.SUCCESS('Todos los campos "levels" han sido eliminados de los CompletedForms existentes.'))