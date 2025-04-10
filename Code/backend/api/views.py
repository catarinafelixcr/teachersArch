from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.core.mail import send_mail
from uuid import uuid4
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.shortcuts import redirect


class UtilizadorViewSet(viewsets.ModelViewSet):
    queryset = Utilizador.objects.all()
    serializer_class = UtilizadorSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class AlunoGitlabActViewSet(viewsets.ModelViewSet):
    queryset = AlunoGitlabAct.objects.all()
    serializer_class = AlunoGitlabActSerializer

class PrevisaoViewSet(viewsets.ModelViewSet):
    queryset = Previsao.objects.all()
    serializer_class = PrevisaoSerializer

class PrevisaoGrupoViewSet(viewsets.ModelViewSet):
    queryset = PrevisaoGrupo.objects.all()
    serializer_class = PrevisaoGrupoSerializer

class GrupoProjectViewSet(viewsets.ModelViewSet):
    queryset = GrupoProject.objects.all()
    serializer_class = GrupoProjectSerializer

class TeacherGrupoViewSet(viewsets.ModelViewSet):
    queryset = TeacherGrupo.objects.all()
    serializer_class = TeacherGrupoSerializer

class AlunoGitlabactPrevisaoViewSet(viewsets.ModelViewSet):
    queryset = AlunoGitlabactPrevisao.objects.all()
    serializer_class = AlunoGitlabactPrevisaoSerializer


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ----------------------------
# Endpoint de Registo (POST)
# ----------------------------
@api_view(['POST'])
def register_teacher(request):
    # - Gera um token de ativação único
    # - Marca a conta como inativa (is_active=False)
    # - Envia um email com link para ativar
    data = request.data

    name = data.get('fullname')
    email = data.get('email')
    password = data.get('password')
    teacher_id_raw = data.get('teacherid')

    try:
        utilizador_id = int(teacher_id_raw)
    except (TypeError, ValueError):
        return Response({'error': 'Teacher ID must be a number.'}, status=400)

    if not all([name, email, password, utilizador_id]):
        return Response({'error': 'Todos os campos são obrigatórios'}, status=400)

    if Utilizador.objects.filter(id=utilizador_id).exists():
        return Response({'error': 'Já existe um utilizador com esse ID'}, status=400)

    activation_token = str(uuid4())

    utilizador = Utilizador.objects.create(
        id=utilizador_id,
        name=name,
        email=email,
        password=make_password(password),
        is_active=False,
        activation_token=activation_token
    )

    Teacher.objects.create(
        utilizador=utilizador,
        teacher_name=name,
        link_gitlab=None
    )

    # Link de ativação
    activation_url = f"http://localhost:8000/api/activate/{activation_token}/"

    send_mail(
        subject='Activate your TeacherSArch account',
        message=(
            f"Hi {name},\n\n"
            f"Thank you for registering on TeacherSArch!\n\n"
            f"To complete your registration and activate your account, please click the link below:\n\n"
            f"{activation_url}\n\n"
            f"If you didn’t request this registration, please ignore this email.\n\n"
            f"Best regards,\n"
            f"The TeacherSArch Team"
        ),
        from_email='noreply@teachersarch.com',
        recipient_list=[email]
    )


    return Response({'success': 'Conta criada! Verifique o seu email para ativar a conta.'})

@api_view(['GET'])
def activate_account(request, token):
    try:
        user = Utilizador.objects.get(activation_token=token)
        user.is_active = True
        user.activation_token = None  # token usado, remove
        user.save()
        return redirect('http://localhost:3000/login?activated=true')

    except Utilizador.DoesNotExist:
        return Response({'error': 'Token inválido ou já usado.'}, status=400)


# --------------------------------------------
# Endpoint de Recuperação da Password (POST)
# --------------------------------------------
# Função de recuperação de senha
@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email é obrigatório."}, status=400)

    try:
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Nenhuma conta com esse email."}, status=404)
    except User.MultipleObjectsReturned:
        return Response({"error": "Mais de um usuário encontrado com esse email."}, status=400)

    # Gera uid e token seguros
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # Gera link para o frontend
    reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
    print("🔗 Link de reset gerado:", reset_link)  # Apenas para testes locais

    # Nome para exibir no email (se houver)
    user_display_name = user.get_full_name() or user.username or "User"

    # Mensagem personalizada
    subject = 'Password Recovery - TeacherSArch'
    message = f"""
Hello {user_display_name},

We received a request to reset your password.

Click the link below to set a new password:
{reset_link}

If you didn’t request this, please ignore this email.

—
TeacherSArch Team
"""

    send_mail(subject, message, 'projetopecd@gmail.com', [user.email])

    return Response({"success": "Recovery instructions sent to your email."})


# Função para confirmar a redefinição da senha
@api_view(['POST'])
def reset_password_confirm(request):
    from django.utils.http import urlsafe_base64_decode
    from django.contrib.auth.tokens import default_token_generator

    uidb64 = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    if not all([uidb64, token, new_password]):
        return Response({"error": "Todos os campos são obrigatórios."}, status=400)

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Utilizador.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, Utilizador.DoesNotExist):
        return Response({"error": "Utilizador inválido."}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Token inválido ou expirado."}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"success": "Password updated successfully."})