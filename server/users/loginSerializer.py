from django.contrib.auth import authenticate
from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import get_user_model




User = get_user_model()

class CustomLoginSerializer(LoginSerializer):
    username = None

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email:
            raise serializers.ValidationError('Email is required.', code='authorization')

        if email and password:
            # Check if user with this email exists in the database
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('User with this email does not exist.', code='authorization')

            # Check if password is correct
            if not user.check_password(password):
                raise serializers.ValidationError('Incorrect password.', code='authorization')
            
            # Authenticate user with provided credentials
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if not user:
                raise serializers.ValidationError('Unable to log in with provided credentials.', code='authorization')
        else:
            raise serializers.ValidationError('Both email and password are required.', code='authorization')

        attrs['user'] = user
        return attrs