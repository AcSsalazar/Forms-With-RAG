from rest_framework.permissions import BasePermission, IsAuthenticated

class IsAuthenticatedOrReadOnly(BasePermission):
    """
    Permite acceso de lectura a cualquier usuario, pero requiere autenticación
    para cualquier otro método (POST, PUT, DELETE, etc.)
    """
    def has_permission(self, request, view):
        # Permite GET, HEAD, OPTIONS
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Requiere autenticación para otros métodos
        return IsAuthenticated().has_permission(request, view)