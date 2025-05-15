from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView 


router = DefaultRouter()
router.register(r'utilizadores', UtilizadorViewSet) # CRUD de utilizadores
router.register(r'teachers', TeacherViewSet)    # CRUD de professores 
router.register(r'grupos', GrupoViewSet)    # CRUD de grupos 
router.register(r'projects', ProjectViewSet)    # CRUD de projetos 
router.register(r'alunos_gitlab', AlunoGitlabActViewSet)    # CRUD de atividade de GitLab dos alunos 
router.register(r'previsoes', PrevisaoViewSet)  # CRUD de previsões 
router.register(r'previsao_grupo', PrevisaoGrupoViewSet)    # associa as previsões a grupos 
router.register(r'grupo_project', GrupoProjectViewSet)  # associa grupos a projetos 
router.register(r'teacher_grupo', TeacherGrupoViewSet)  # associa professores a grupos 
router.register(r'aluno_previsao', AlunoGitlabactPrevisaoViewSet)   # liga atividades GitLab a previsões


urlpatterns = [
    path('api/extract_students/', views.extract_students, name='extract_students'), # extrair os alunos 
    path('api/save_groups/', views.save_groups, name='save_groups'),    # guardar grupos 
    path('api/register/', register_teacher),    # registar novo professor
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # login com email+password -> JWT (token)
    path('auth/token/login/', CustomLoginView.as_view(), name='custom_login'),  # outra versão do login
    path('api/activate/<str:token>/', activate_account, name='activate_account'),  # ativação da conta via token
    path('api/auth/', include('dj_rest_auth.urls')),    
    path('api/password-reset/confirm/', reset_password_confirm, name='password_reset_confirm'), # confirmar e redifinir a password
    path('api/password-reset/', password_reset_request, name='password_reset'), # pedir reset da password 
    path('api/profile/', get_profile),  # obter dados do utilizador autenticado 
    path('api/group_predictions/<str:group_name>/', views.get_group_predictions, name='get_group_predictions'), # previsões de um grupo específico 
    path('api/groups/', list_groups),   # listar grupos 
    path('api/students_at_risk/', students_at_risk, name='students_at_risk'),   # lista de alunos em risco 
    path('api/prediction_dates/', views.prediction_dates),  # datas em que foram feitas as previsões 
    path('api/predictions_by_date/<str:date>/', views.predictions_by_date), # previsões feitas numa data específica 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),   # obter novo token 
    path('api/compare_predictions/<str:group_name>/<str:base_date>/<str:compare_date>/', views.compare_predictions_by_date),    # comparar previsões de duas datas 
    path('api/latest_prediction_date/', views.latest_prediction_date), # obter a previsão mais recente 
    path('api/prediction_dates/<str:group_name>/', views.prediction_dates_for_group),   # datas de previsão para um grupo específico

    path('', include(router.urls)),
]