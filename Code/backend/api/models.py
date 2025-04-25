from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

from django.utils import timezone
from datetime import timedelta



class UtilizadorManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a User with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) # Use the inherited method
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Creates and saves a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True) # Superusers should be active by default

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        # Ensure required fields (like 'name' if it's in REQUIRED_FIELDS) are handled
        # The createsuperuser command will prompt for fields in REQUIRED_FIELDS
        return self.create_user(email, password, **extra_fields)


class Utilizador(AbstractBaseUser, PermissionsMixin): # Inherit from AbstractBaseUser and PermissionsMixin
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=512, null=True, blank=True)
    # 'password' field is provided by AbstractBaseUser
    # 'last_login' field is provided by AbstractBaseUser
    email = models.EmailField( # Use EmailField for better validation
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=False) # Keep this for activation flow
    activation_token = models.CharField(max_length=128, blank=True, null=True, unique=True, db_index=True) # Add db_index

    # Add fields required by Django admin/auth system
    is_staff = models.BooleanField(default=False) # Required for admin access
    # is_superuser is provided by PermissionsMixin
    # groups and user_permissions fields are provided by PermissionsMixin

    objects = UtilizadorManager() # Link the custom manager

    # --- THE FIX ---
    USERNAME_FIELD = 'email' # Tell Django to use 'email' for login/identification
    REQUIRED_FIELDS = ['name'] # Fields prompted for when using createsuperuser (besides email/password)

    def __str__(self):
        return self.email

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    activation_token = models.CharField(max_length=128, blank=True, null=True, unique=True, db_index=True)
    token_expiry = models.DateTimeField(null=True, blank=True)  # Campo para expiração do token

    def set_activation_token(self, token):
        self.activation_token = token
        self.token_expiry = timezone.now() + timedelta(hours=24)  # Expira após 24 horas
        self.save()

    def is_token_expired(self):
        return self.token_expiry and timezone.now() > self.token_expiry

class Teacher(models.Model):
    utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, primary_key=True, related_name='teacher')
    link_gitlab = models.CharField(max_length=512, unique=True, null=True, blank=True)

class Grupo(models.Model):
    group_id = models.BigAutoField(primary_key=True)
    group_name = models.CharField(max_length=512, unique=True)

class Project(models.Model):
    project_id = models.BigAutoField(primary_key=True)
    repo_url = models.CharField(max_length=512)

class AlunoGitlabAct(models.Model):
    #utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, primary_key=True)
    # acho que não faz sentido ser OneToOne, porque um Utilizador (que representa um estudante aqui) pode ter 
    # muitos registos AlunoGitlabAct (por exemplo, um para cada grupo em que participa, 
    # ou talvez até registos de diferentes momentos no tempo se a lógica evoluir).
    # cada registo AlunoGitlabAct pertence a um e apenas um Utilizador (o estudante cuja atividade está a ser registada).
    #utilizador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gitlab_activities')
    
    id = models.BigAutoField(primary_key=True) # antigo student_num --> mas automatico!!
    #student_num = models.BigIntegerField()
    group = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    handle = models.CharField(max_length=128)

    # métricas:
    total_commits = models.BigIntegerField()
    sum_lines_added = models.BigIntegerField()
    sum_lines_deleted = models.BigIntegerField()
    sum_lines_per_commit = models.BigIntegerField()
    active_days = models.BigIntegerField()
    last_minute_commits = models.BooleanField()
    total_merge_requests = models.BigIntegerField()
    merged_requests = models.BigIntegerField()
    review_comments_given = models.BigIntegerField()
    review_comments_received = models.BigIntegerField()
    total_issues_created = models.BigIntegerField()
    total_issues_assigned = models.BigIntegerField()
    issues_resolved = models.BooleanField()
    issue_participation = models.BooleanField()
    branches_created = models.BigIntegerField()
    merges_to_main_branch = models.BigIntegerField()

    class Meta:
        unique_together = (("group", "handle"),)
    
    def __str__(self):
        try:
            return f"Activity for {self.utilizador.email} in Group '{self.group.group_name}'"
        except: 
            return f"Activity record {self.id}"

class Previsao(models.Model):
    prevision_id = models.BigAutoField(primary_key=True)
    prev_category = models.CharField(max_length=255)
    student = models.ForeignKey(Utilizador, on_delete=models.CASCADE)
    prev_grade = models.BigIntegerField()
    faling_risk = models.BooleanField()
    prev_date = models.DateField()

    class Meta:
        unique_together = (("prev_date", "student"),)

class AlunoGitlabactPrevisao(models.Model):
    aluno_gitlabact = models.ForeignKey(AlunoGitlabAct, on_delete=models.CASCADE)
    previsao = models.ForeignKey(Previsao, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("aluno_gitlabact", "previsao"),)

class PrevisaoGrupo(models.Model):
    previsao = models.ForeignKey(Previsao, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("previsao", "grupo"),)

class GrupoProject(models.Model):
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("grupo", "project"),)

class TeacherGrupo(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("teacher", "grupo"),)