from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

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
    utilizador_id = data.get('teacherid')


    if not all([name, email, password, utilizador_id]):
        return Response({'error': 'Todos os campos são obrigatórios'}, status=400)

    if Utilizador.objects.filter(id=utilizador_id).exists():
        return Response({'error': 'Já existe um utilizador com esse ID'}, status=400)

    hashed_password = make_password(password)

    utilizador = Utilizador.objects.create(
        id=utilizador_id,
        name=name,
        email=email,
        password=hashed_password  # password segura!
    )

    Teacher.objects.create(
        utilizador=utilizador,
        teacher_name=name,
        link_gitlab=""
    )

    return Response({'success': 'Conta criada com sucesso!'})




