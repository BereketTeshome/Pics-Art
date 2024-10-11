from rest_framework import serializers
from django.contrib.auth import get_user_model
from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

User = get_user_model()

class CustomRegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    "A user is already registered with this e-mail address."
                )
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("The two password fields didn't match.")
        return data

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'name': self.validated_data.get('name', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user.name = self.cleaned_data.get('name')
        user.email = self.cleaned_data.get('email')
        user.set_password(self.cleaned_data.get('password1'))
        user.save()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        return user