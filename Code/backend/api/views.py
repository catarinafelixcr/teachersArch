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
from django.db import IntegrityError
from django.utils import timezone

from .models import Previsao
import joblib


from .utils.extract import extract_from_gitlab
from django.views.decorators.csrf import csrf_exempt
#from .serializers import ComparePredictionSerializer


import logging
import traceback


# ----------------------------models ML----------------------------
from api.utils.ml_model_loader import select_model


# -----------------------------------------------------------------

logger = logging.getLogger(__name__)


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
        # Cria o utilizador
        utilizador = Utilizador.objects.create(
            name=name,
            email=email,
            password=make_password(password),
            is_active=False,
            activation_token=activation_token
        )

        # Cria o Teacher automaticamente assim que o utilizador for criado
        Teacher.objects.create(
            utilizador=utilizador,
            link_gitlab=None
        )

        # Enviar email de ativação
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

from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import Utilizador, Teacher

@api_view(['DELETE'])
def delete_user_by_email(request, email):
    try:
        # Encontre o usuário pelo e-mail
        usuario = Utilizador.objects.get(email=email)

        # Apague o registro de Teacher relacionado
        Teacher.objects.filter(utilizador=usuario).delete()

        # Apague o registro do Utilizador
        usuario.delete()

        return Response({"success": f"User {email} and related records have been deleted."})
    except Utilizador.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

@api_view(['GET'])
def activate_account(request, token):
    try:
        user = Utilizador.objects.get(activation_token=token)

        # Verificar se o token expirou
        if user.is_token_expired():
            return Response({'error': 'Token de ativação expirado.'}, status=400)

        user.is_active = True
        user.activation_token = None  # Token usado, remove
        user.save()

        return redirect('http://localhost:3000/login?activated=true')
    except Utilizador.DoesNotExist:
        return Response({'error': 'Token inválido ou já usado.'}, status=400)

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
        user.activation_token = None  
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
    user.activation_token = None  
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

from api.utils.extract import extract_from_gitlab  

from django.utils.dateparse import parse_datetime

from api.utils.ml_model_loader import select_model

from django.utils.dateparse import parse_datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import logging

from api.models import Teacher, Grupo, AlunoGitlabAct, TeacherGrupo, Previsao
from api.utils.ml_model_loader import select_model

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_groups(request):
    logger.info(f"Tentativa de salvar grupos pelo utilizador: {request.user.email}")
    try:
        data = request.data
        repo_url = data.get("repo_url")
        groups_data = data.get("groups", {})
        metrics = data.get("metrics", {})
        data_base = data.get("data_base")

        if not repo_url or not groups_data:
            logger.warning("Pedido save_groups recebido sem repo_url ou groups.")
            return JsonResponse({"error": "Missing repository URL or groups data."}, status=400)

        teacher = Teacher.objects.get(utilizador=request.user)
        saved_count = 0

        data_registo = timezone.now().replace(microsecond=0)
        if data_base:
            parsed = parse_datetime(data_base)
            if parsed:
                data_registo = parsed.replace(microsecond=0)

        for group_name, handles in groups_data.items():
            grupo, _ = Grupo.objects.get_or_create(group_name=group_name)
            TeacherGrupo.objects.get_or_create(teacher=teacher, grupo=grupo)

            for handle in handles:
                metric_data = metrics.get(handle, {})

                aluno_gitlab, _ = AlunoGitlabAct.objects.update_or_create(
                    group=grupo,
                    handle=handle,
                    defaults={
                        "data_registo": data_registo,
                        "total_commits": metric_data.get("total_commits", 0),
                        "sum_lines_added": metric_data.get("sum_lines_added", 0),
                        "sum_lines_deleted": metric_data.get("sum_lines_deleted", 0),
                        "sum_lines_per_commit": metric_data.get("sum_lines_per_commit", 0),
                        "active_days": metric_data.get("active_days", 0),
                        "last_minute_commits": bool(metric_data.get("last_minute_commits", 0) > 0),
                        "total_merge_requests": metric_data.get("total_merge_requests", 0),
                        "merged_requests": metric_data.get("merged_requests", 0),
                        "review_comments_given": metric_data.get("review_comments_given", 0),
                        "review_comments_received": metric_data.get("review_comments_received", 0),
                        "total_issues_created": metric_data.get("total_issues_created", 0),
                        "total_issues_assigned": metric_data.get("total_issues_assigned", 0),
                        "issues_resolved": bool(metric_data.get("issues_resolved", False)),
                        "issue_participation": bool(metric_data.get("issue_participation", False)),
                        "branches_created": metric_data.get("branches_created", 0),
                        "merges_to_main_branch": metric_data.get("merges_to_main_branch", 0)
                    }
                )

                X_input = [[
                    metric_data.get("total_commits", 0),
                    metric_data.get("sum_lines_added", 0),
                    metric_data.get("sum_lines_deleted", 0),
                    metric_data.get("sum_lines_per_commit", 0),
                    metric_data.get("active_days", 0),
                    metric_data.get("last_minute_commits", 0),
                    metric_data.get("total_merge_requests", 0),
                    metric_data.get("merged_requests", 0),
                    metric_data.get("review_comments_given", 0),
                    metric_data.get("review_comments_received", 0),
                    metric_data.get("total_issues_created", 0),
                    metric_data.get("total_issues_assigned", 0),
                    int(metric_data.get("issues_resolved", False)),
                    int(metric_data.get("issue_participation", False)),
                    metric_data.get("branches_created", 0),
                    metric_data.get("merges_to_main_branch", 0)
                ]]

                model = select_model(data_registo,grupo)
                predicted_grade = float(model.predict(X_input)[0])
                predicted_grade = round(min(20, max(0, predicted_grade)))

                Previsao.objects.update_or_create(
                    student=request.user,
                    prev_date=data_registo,
                    defaults={
                        "aluno_gitlabact": aluno_gitlab,
                        "prev_category": "ml_ensemble",
                        "prev_grade": predicted_grade,
                        "faling_risk": predicted_grade < 10
                    }
                )

                saved_count += 1

        return JsonResponse({"status": "ok", "created": saved_count})

    except Teacher.DoesNotExist:
        logger.error(f"Utilizador {request.user.email} tentou salvar grupos mas não é um Teacher.")
        return JsonResponse({"error": "User is not registered as a teacher."}, status=403)
    except Exception as e:
        logger.exception(f"ERRO em save_groups para {request.user.email}")
        return JsonResponse({"error": f"Ocorreu um erro interno: {str(e)}"}, status=500)
    


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_history(request, group_name):
    try:
        grupo = Grupo.objects.get(group_name=group_name)
        registos = AlunoGitlabAct.objects.filter(group=grupo).order_by('-data_registo')

        data = []
        for r in registos:
            data.append({
                "handle": r.handle,
                "total_commits": r.total_commits,
                "sum_lines_added": r.sum_lines_added,
                "sum_lines_deleted": r.sum_lines_deleted,
                "sum_lines_per_commit": r.sum_lines_per_commit,
                "active_days": r.active_days,
                "last_minute_commits": r.last_minute_commits,
                "total_merge_requests": r.total_merge_requests,
                "merged_requests": r.merged_requests,
                "review_comments_given": r.review_comments_given,
                "review_comments_received": r.review_comments_received,
                "total_issues_created": r.total_issues_created,
                "total_issues_assigned": r.total_issues_assigned,
                "issues_resolved": r.issues_resolved,
                "issue_participation": r.issue_participation,
                "branches_created": r.branches_created,
                "merges_to_main_branch": r.merges_to_main_branch,
                "data_registo": r.data_registo,
            })

        return Response({"group": group_name, "records": data})

    except Grupo.DoesNotExist:
        return Response({"error": f"O grupo '{group_name}' não existe."}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group_predictions(request, group_name):
    try:
        grupo = Grupo.objects.get(group_name=group_name)
        alunos = AlunoGitlabAct.objects.filter(group=grupo)

        # NOVO: capturar o parâmetro ?stage=1 a 5
        stage = request.GET.get('stage')
        if stage:
            try:
                stage = int(stage)
                if stage not in [1, 2, 3, 4, 5]:
                    raise ValueError()
            except ValueError:
                return Response({"error": "Parâmetro 'stage' deve ser um número de 1 a 5."}, status=400)

        response_data = []

        for aluno in alunos:
            if stage:
                # NOVO: aplicar modelo correspondente ao stage
                from api.utils.ml_model_loader import select_model
                X_input = [[
                    aluno.total_commits,
                    aluno.sum_lines_added,
                    aluno.sum_lines_deleted,
                    aluno.sum_lines_per_commit,
                    aluno.active_days,
                    int(aluno.last_minute_commits),
                    aluno.total_merge_requests,
                    aluno.merged_requests,
                    aluno.review_comments_given,
                    aluno.review_comments_received,
                    aluno.total_issues_created,
                    aluno.total_issues_assigned,
                    int(aluno.issues_resolved),
                    int(aluno.issue_participation),
                    aluno.branches_created,
                    aluno.merges_to_main_branch,
                ]]
                model = select_model(stage=stage)
                predicted_grade = float(model.predict(X_input)[0])
                predicted_grade = round(min(20, max(0, predicted_grade)))
            else:
                # Modo padrão: usa a previsão mais recente
                previsao = Previsao.objects.filter(aluno_gitlabact=aluno).order_by('-prev_date').first()
                predicted_grade = previsao.prev_grade if previsao else None

            response_data.append({
                "handle": aluno.handle,
                "predicted_grade": predicted_grade,
                "risk": predicted_grade is not None and predicted_grade < 10,
                "registered_at": aluno.data_registo,
                "metrics": {
                    "total_commits": aluno.total_commits,
                    "sum_lines_added": aluno.sum_lines_added,
                    "sum_lines_deleted": aluno.sum_lines_deleted,
                    "sum_lines_per_commit": aluno.sum_lines_per_commit,
                    "active_days": aluno.active_days,
                    "last_minute_commits": aluno.last_minute_commits,
                    "total_merge_requests": aluno.total_merge_requests,
                    "merged_requests": aluno.merged_requests,
                    "review_comments_given": aluno.review_comments_given,
                    "review_comments_received": aluno.review_comments_received,
                    "total_issues_created": aluno.total_issues_created,
                    "total_issues_assigned": aluno.total_issues_assigned,
                    "issues_resolved": aluno.issues_resolved,
                    "issue_participation": aluno.issue_participation,
                    "branches_created": aluno.branches_created,
                    "merges_to_main_branch": aluno.merges_to_main_branch,
                }
            })

        return Response({"group": group_name, "predictions": response_data})

    except Grupo.DoesNotExist:
        return Response({"error": f"O grupo '{group_name}' não existe."}, status=404)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_groups(request):
    grupos = Grupo.objects.values_list('group_name', flat=True).distinct()
    return Response({"groups": list(grupos)})





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def students_at_risk(request):
    alunos = AlunoGitlabAct.objects.all()

    data = []
    for aluno in alunos:
        data.append({
            "id": aluno.id,
            "handle": aluno.handle,
            "performance": aluno.performance if hasattr(aluno, 'performance') else "Unknown", 
            "is_at_risk": aluno.total_commits < 10,  
            "last_active": aluno.data_registo,
        })

    return Response({"students": data})


# Para preencher os select da interface  de previsão de tempo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prediction_dates(request):
    datas = AlunoGitlabAct.objects.order_by('-data_registo').values_list('data_registo', flat=True).distinct()
    datas_formatadas = sorted({d.strftime('%Y-%m-%d') for d in datas}, reverse=True)
    return Response({"dates": list(datas_formatadas)})



# Para obter previsões por data de um grupo específico
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def predictions_by_date(request, date):
    group_name = request.GET.get('group')
    if not group_name:
        return Response({"error": "Missing group parameter."}, status=400)

    try:
        grupo = Grupo.objects.get(group_name=group_name)
    except Grupo.DoesNotExist:
        return Response({"error": "Grupo não encontrado."}, status=404)

    alunos = AlunoGitlabAct.objects.filter(
        group=grupo,
        data_registo__date=date
    )

    data = []
    for aluno in alunos:
        predicted_grade = round(min(20, max(0, aluno.total_commits / 5 + aluno.active_days)), 1)
        data.append({
            "handle": aluno.handle,
            "predicted_grade": predicted_grade,
            "registered_at": aluno.data_registo,
        })

    return Response({"predictions": data})



from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

from django.utils.dateparse import parse_date

from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import Grupo, Previsao

@api_view(['GET'])
def compare_predictions_by_date(request, group_name, base_date, compare_date):
    try:
        grupo = Grupo.objects.get(group_name=group_name)
        base_date = parse_date(base_date)
        compare_date = parse_date(compare_date)

        base_prevs = Previsao.objects.filter(
            aluno_gitlabact__group=grupo,
            prev_date__date=base_date
        )
        compare_prevs = Previsao.objects.filter(
            aluno_gitlabact__group=grupo,
            prev_date__date=compare_date
        )

        def extract_metric_data(prevs):
            metrics = {
                'prev_grade': [],
                'total_commits': [],
                'total_issues_created': [],
                'active_days': []
            }

            for p in prevs:
                ag = p.aluno_gitlabact
                metrics['prev_grade'].append(p.prev_grade)
                metrics['total_commits'].append(ag.total_commits)
                metrics['total_issues_created'].append(ag.total_issues_created)
                metrics['active_days'].append(ag.active_days)

            def compute_stats(values):
                if not values:
                    return { 'values': [], 'mean': 0, 'stdDev': 0, 'min': 0, 'max': 0 }
                mean = sum(values) / len(values)
                std = (sum((v - mean) ** 2 for v in values) / len(values)) ** 0.5
                return {
                    'values': values,
                    'mean': round(mean, 1),
                    'stdDev': round(std, 1),
                    'min': min(values),
                    'max': max(values)
                }

            return { metric: compute_stats(values) for metric, values in metrics.items() }

        return Response({
            "base": extract_metric_data(base_prevs),
            "compare": extract_metric_data(compare_prevs)
        })

    except Grupo.DoesNotExist:
        return Response({"error": "Grupo não encontrado."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)







@api_view(['GET'])
def latest_prediction_date(request):
    latest_date = Previsao.objects.order_by('-prev_date').values_list('prev_date', flat=True).first()
    return Response({'latest_date': latest_date})




@api_view(['GET'])
def prediction_dates_for_group(request, group_name):
    dates = Previsao.objects.filter(
        aluno_gitlabact__group__group_name=group_name
    ).values_list('prev_date', flat=True).distinct().order_by('-prev_date')
    
    formatted_dates = [d.strftime('%Y-%m-%dT%H:%M:%S') for d in dates]
    return Response({'dates': formatted_dates})
