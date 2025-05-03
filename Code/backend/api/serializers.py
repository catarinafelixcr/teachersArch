from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import check_password
from .models import Utilizador
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from dj_rest_auth.serializers import PasswordResetSerializer
from django.core.mail import send_mail
from rest_framework.exceptions import AuthenticationFailed
from .models import Utilizador

class UtilizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class AlunoGitlabActSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlunoGitlabAct
        fields = '__all__'

class PrevisaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Previsao
        fields = '__all__'

class PrevisaoGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrevisaoGrupo
        fields = '__all__'

class GrupoProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoProject
        fields = '__all__'

class TeacherGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherGrupo
        fields = '__all__'

class AlunoGitlabactPrevisaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlunoGitlabactPrevisao
        fields = '__all__'


class UtilizadorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = ['id', 'name', 'email']

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        print(f"Attempting login for email: {email}")
        try:
            user = Utilizador.objects.get(email=email)
            print(f"User found: {user.email}, Active: {getattr(user, 'is_active', False)}") # Check is_active directly
        except Utilizador.DoesNotExist:
            print("User lookup failed.")
            raise AuthenticationFailed("Email inválido")

        if not check_password(password, user.password):
            print("Password check failed.")
            raise AuthenticationFailed("Password inválida")
        
        if not getattr(user, 'is_active', True):  # Default para True por segurança em dev
            print("Account not active check failed.")
            raise AuthenticationFailed("Account not activated. Please check your email.")


        # Criar tokens manualmente
        refresh = RefreshToken.for_user(user)
        print("Token generation successful.", refresh)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    
class CustomPasswordResetSerializer(PasswordResetSerializer):
    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        uid = context['uid']
        token = context['token']
        reset_link = f"http://localhost:3000/reset-password-confirm/{uid}/{token}/"

        subject = "Reset Your TeacherSArch Password"
        message = f"""
Hello!

We received a request to reset your password on the TeacherSArch platform.

Click the link below to create a new password:
{reset_link}

If you didn't make this request, you can ignore this email.

Best regards,
The TeacherSArch Team
        """

        send_mail(subject, message, from_email, [to_email])


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # aqui está a magia

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adicionar info extra ao token, se quiseres
        token['email'] = user.email
        return token
    
'''
class ComparePredictionSerializer(serializers.Serializer):
    handle = serializers.CharField()
    predicted_grade = serializers.FloatField()
    registered_at = serializers.DateTimeField()

'''