from rest_framework import viewsets
from django.contrib.auth.hashers import make_password
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.core.mail import send_mail
from uuid import uuid4
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import redirect
from rest_framework import status
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .serializers import UtilizadorProfileSerializer
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
from .models import Utilizador, Teacher, Grupo, AlunoGitlabAct, TeacherGrupo

from .utils.extract import extract_from_gitlab
from django.views.decorators.csrf import csrf_exempt


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
    data = request.data

    name = data.get('fullname')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return Response({'error': 'Todos os campos são obrigatórios.'}, status=400)
    
    if Utilizador.objects.filter(email=email).exists():
        return Response({'email': 'Este email já está registado.'}, status=400)


    activation_token = str(uuid4())

    try:
        utilizador = Utilizador.objects.create(
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

    except IntegrityError as e:
        errors = {}
        if 'email' in str(e):
            errors['email'] = 'Este email já está registado.'
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = UtilizadorProfileSerializer(user)
    return Response(serializer.data)


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


@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email é obrigatório."}, status=400)

    user = Utilizador.objects.filter(email=email).first()
    if not user:
        return Response({"success": "Se existir uma conta com esse email, enviámos instruções."})

    token = str(uuid4())
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    user.activation_token = token
    user.save()

    reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
    #print(f"RESET LINK: {reset_link}")

    subject = 'Password Recovery - TeacherSArch'
    message = f"""
    Hello {user.name},

    We received a request to reset your password.

    Click the link below to set a new one:
    {reset_link}

    If this wasn't you, you can ignore this email.

    — TeacherSArch Team
    """

    send_mail(
        subject,
        message,
        'projetopecd@gmail.com',
        [user.email],
        fail_silently=False
    )

    return Response({"success": "Se existir uma conta com esse email, enviámos instruções."})


@api_view(['POST'])
def reset_password_confirm(request):
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    if not all([token, new_password]):
        return Response({"error": "Todos os campos são obrigatórios."}, status=400)

    user = Utilizador.objects.filter(activation_token=token).first()
    if not user:
        return Response({"error": "Token inválido ou expirado."}, status=400)

    user.set_password(new_password)
    user.activation_token = None  # invalida o token
    user.save()

    return Response({"success": "Password atualizada com sucesso."})

# ----------------------------
# API Views protegidas (autenticadas)
# ----------------------------

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
import traceback

from .models import Utilizador, Teacher, Grupo, AlunoGitlabAct, TeacherGrupo
from .utils.extract import extract_from_gitlab


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def extract_students(request):
    try:
        print("🔔 View extract_students chamada")
        data = request.data
        print("📥 Dados recebidos:", data)

        repo_url = data.get("repo_url")
        if not repo_url:
            return JsonResponse({"error": "Missing repo_url"}, status=400)

        students_data = extract_from_gitlab(repo_url)
        return JsonResponse({"students": students_data}, status=200)

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_groups(request):
    try:
        data = request.data
        repo_url = data.get("repo_url")
        groups = data.get("groups", {})
        metrics = data.get("metrics", {})

        teacher = Teacher.objects.get(utilizador=request.user)

        for group_name, handles in groups.items():
            grupo, _ = Grupo.objects.get_or_create(group_name=group_name)
            TeacherGrupo.objects.get_or_create(teacher=teacher, grupo=grupo)

            for handle in handles:
                try:
                    utilizador = Utilizador.objects.get(email__startswith=handle)
                except Utilizador.DoesNotExist:
                    continue

                metric_data = metrics.get(handle, {})
                AlunoGitlabAct.objects.get_or_create(
                    utilizador=utilizador,
                    group=grupo,
                    defaults={
                        "student_num": 0,
                        "mention_handle": True,
                        "interval": 1,
                        "total_commits": metric_data.get("total_commits", 0),
                        "sum_lines_added": metric_data.get("sum_lines_added", 0),
                        "sum_lines_deleted": metric_data.get("sum_lines_deleted", 0),
                        "sum_lines_per_commit": metric_data.get("sum_lines_per_commit", 0),
                        "active_days": metric_data.get("active_days", 0),
                        "last_minute_commits": metric_data.get("last_minute_commits", 0) > 0,
                        "total_merge_requests": metric_data.get("total_merge_requests", 0),
                        "merged_requests": metric_data.get("merged_requests", 0),
                        "review_comments_given": metric_data.get("review_comments_given", 0),
                        "review_comments_received": metric_data.get("review_comments_received", 0),
                        "total_issues_created": metric_data.get("total_issues_created", 0),
                        "total_issues_assigned": metric_data.get("total_issues_assigned", 0),
                        "issues_resolved": metric_data.get("issues_resolved", False),
                        "issue_participation": metric_data.get("issue_participation", False),
                        "branches_created": metric_data.get("branches_created", 0),
                        "merges_to_main_branch": metric_data.get("merges_to_main_branch", 0),
                    }
                )

        return JsonResponse({"status": "ok"})

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
    
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
