from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Check for the token in the cookies
        raw_token = request.COOKIES.get('access_token')

        if raw_token is not None:
            try:
                # Decode the token manually for debugging
                from rest_framework_simplejwt.tokens import AccessToken
                decoded_token = AccessToken(raw_token)

                # Validate the token
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token
            except Exception as e:
                print("Token validation error:", e)  # Debugging
                raise exceptions.AuthenticationFailed('Invalid token')

        return None