from django.core.management.base import BaseCommand
from forms.models import CompletedForm
import re

class Command(BaseCommand):
    help = 'Actualiza el contenido de CompletedForm para convertir claves en info de camelCase a snake_case y renombrar user_name a full_name y identification_number a document'

    def handle(self, *args, **options):
        # Expresión regular para detectar camelCase
        camel_case_pattern = re.compile(r'([a-z0-9])([A-Z])')

        completed_forms = CompletedForm.objects.all()
        total_forms = completed_forms.count()
        updated_forms = 0

        for form in completed_forms:
            content = form.content
            if 'info' in content:
                info = content['info']
                # Verificar si hay claves en camelCase
                if any(re.search('[A-Z]', key) for key in info.keys()):
                    # Convertir claves a snake_case y renombrar campos
                    new_info = {}
                    for key, value in info.items():
                        # Convertir clave de camelCase a snake_case
                        snake_key = camel_case_pattern.sub(r'\1_\2', key).lower()
                        # Renombrar 'user_name' a 'full_name'
                        if snake_key == 'user_name':
                            snake_key = 'full_name'
                        # Renombrar 'identification_number' a 'document'
                        if snake_key == 'identification_number':
                            snake_key = 'document'
                        new_info[snake_key] = value
                    # Actualizar el contenido
                    content['info'] = new_info
                    # Guardar el formulario actualizado
                    form.content = content
                    form.save()
                    updated_forms += 1
                    self.stdout.write(f'Updated form id {form.id}')
                else:
                    # Manejar el caso donde las claves ya están en snake_case
                    fields_updated = False

                    # Renombrar 'user_name' a 'full_name' si es necesario
                    if 'user_name' in info:
                        info['full_name'] = info.pop('user_name')
                        fields_updated = True

                    # Renombrar 'identification_number' a 'document' si es necesario
                    if 'identification_number' in info:
                        info['document'] = info.pop('identification_number')
                        fields_updated = True

                    if fields_updated:
                        content['info'] = info
                        form.content = content
                        form.save()
                        updated_forms += 1
                        self.stdout.write(f'Updated form id {form.id}')
                    else:
                        self.stdout.write(f'Form id {form.id} already processed')
            else:
                self.stdout.write(f'Form id {form.id} does not have info field')

        self.stdout.write(self.style.SUCCESS(f'Updated {updated_forms} out of {total_forms} completed forms'))