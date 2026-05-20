import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions


class ClerkUser:
    def __init__(self, claims):
        self.claims = claims
        self.id = claims.get("sub")
        self.email = claims.get("email")

    @property
    def is_authenticated(self):
        return True


class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return None

        jwks_url = getattr(settings, "CLERK_JWKS_URL", None)
        if not jwks_url:
            raise exceptions.AuthenticationFailed("Missing CLERK_JWKS_URL")

        try:
            jwk_client = jwt.PyJWKClient(jwks_url)
            signing_key = jwk_client.get_signing_key_from_jwt(token).key

            options = {"verify_aud": bool(getattr(settings, "CLERK_AUDIENCE", None))}
            claims = jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience=getattr(settings, "CLERK_AUDIENCE", None),
                issuer=getattr(settings, "CLERK_ISSUER", None),
                options=options,
            )
        except Exception as exc:
            raise exceptions.AuthenticationFailed("Invalid Clerk token") from exc

        return ClerkUser(claims), claims
