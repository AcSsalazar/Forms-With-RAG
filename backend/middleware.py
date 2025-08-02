from django.middleware.common import CommonMiddleware

class AppendSlashMiddleware(CommonMiddleware):
    """
    Middleware que asegura que todas las URLs terminen en "/".
    Hereda de CommonMiddleware para mantener la funcionalidad base.
    """
    def process_request(self, request):
        # Si la URL no termina en "/" y no es una URL de API
        if not request.path.endswith('/') and not request.path.startswith('/api/'):
            # Agregar "/" al final de la URL
            request.path = request.path + '/'
            request.path_info = request.path_info + '/'
        return None