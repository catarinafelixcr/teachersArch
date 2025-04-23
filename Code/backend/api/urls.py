from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from . import views

router = DefaultRouter()
router.register(r'utilizadores', UtilizadorViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'grupos', GrupoViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'alunos_gitlab', AlunoGitlabActViewSet)
router.register(r'previsoes', PrevisaoViewSet)
router.register(r'previsao_grupo', PrevisaoGrupoViewSet)
router.register(r'grupo_project', GrupoProjectViewSet)
router.register(r'teacher_grupo', TeacherGrupoViewSet)
router.register(r'aluno_previsao', AlunoGitlabactPrevisaoViewSet)


urlpatterns = [
    path('api/extract_students/', views.extract_students, name='extract_students'),
    path('api/save_groups/', views.save_groups, name='save_groups'),
    path('api/register/', register_teacher),
    path('auth/token/login/', CustomLoginView.as_view(), name='custom_login'),
    path('api/activate/<str:token>/', activate_account, name='activate_account'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/password-reset/confirm/', reset_password_confirm, name='password_reset_confirm'),
    path('api/password-reset/', password_reset_request, name='password_reset'),
    path('api/profile/', get_profile),

    path('', include(router.urls)),
]