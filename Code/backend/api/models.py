from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


# É um gestor personalizado que define como criar utilizadores normais e superutilizadores no sistema.
class UtilizadorManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a User with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Creates and saves a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True) 

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)



# Modelo principal de contas de utilizador, substitui o User padrão do django
# Representa qualquer utilizador, controla a autentificação por email, gera a
# ativação da conta com activation_token e valida-o
class Utilizador(AbstractBaseUser, PermissionsMixin):   # herda deste parâmetros para autentificação
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=512, null=True, blank=True)
    # Campo do login
    email = models.EmailField( 
        verbose_name='email address',
        max_length=255,
        unique=True,
    )

    # Atributos adicionais de conta
    is_active = models.BooleanField(default=False) 
    activation_token = models.CharField(max_length=128, blank=True, null=True, unique=True, db_index=True) 
    is_staff = models.BooleanField(default=False) 
    objects = UtilizadorManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name'] 

    def __str__(self):
        return self.email

    # Guarda a password encriptada
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    # Verifica se a password está correta
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    activation_token = models.CharField(max_length=128, blank=True, null=True, unique=True, db_index=True)
    token_expiry = models.DateTimeField(null=True, blank=True)  # Campo para expiração do token

    # Gera e guarda um token com validade de 24h
    def set_activation_token(self, token):
        self.activation_token = token
        self.token_expiry = timezone.now() + timedelta(hours=24)  # Expira após 24 horas
        self.save()

    # Verifica se o token expirou
    def is_token_expired(self):
        return self.token_expiry and timezone.now() > self.token_expiry

# Relaciona um Utilizador a um professor 
class Teacher(models.Model):
    # Relação de 1 para 1
    utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, primary_key=True, related_name='teacher')
    # Campo opcional
    link_gitlab = models.CharField(max_length=512, unique=True, null=True, blank=True)

# Representa todos os grupos dos estudantes 
class Grupo(models.Model):
    # Identificador do repositório
    group_id = models.BigAutoField(primary_key=True)
    # Nome único do grupo
    group_name = models.CharField(max_length=512, unique=True)


# Representa um projeto do GitLab
class Project(models.Model):
    # Identificador do Projeto
    project_id = models.BigAutoField(primary_key=True)
    # URL do repositório GitLab
    repo_url = models.CharField(max_length=512)


# Atividades de um estudante no GitLab
class AlunoGitlabAct(models.Model):
    # Chave primária
    id = models.BigAutoField(primary_key=True) 
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
    data_registo = models.DateTimeField(default=timezone.now)  

    class Meta:
        unique_together = (("group", "handle", "data_registo"),)
    
    # Para mostrar o email do utilizador e nome do grupo 
    def __str__(self):
        try:
            return f"Activity for {self.utilizador.email} in Group '{self.group.group_name}'"
        except: 
            return f"Activity record {self.id}"


# Registo da previsão de desempenho de um aluno 
class Previsao(models.Model):
    aluno_gitlabact = models.ForeignKey(AlunoGitlabAct, on_delete=models.CASCADE, related_name='previsoes') # origem dos dados da previsão
    prevision_id = models.BigAutoField(primary_key=True)    # identificador único da previsão 
    prev_category = models.CharField(max_length=55) # categoria da previsão 
    student = models.ForeignKey(Utilizador, on_delete=models.CASCADE)   # aluno a quem pertence a previsão
    prev_grade = models.BigIntegerField()   # nota prevista
    faling_risk = models.BooleanField() # indica se há risco de reprovar
    prev_date = models.DateTimeField(auto_now_add=True) # data/hora em que a previsão foi feita

    # Retorna uma string para representar a previsão (ex: miguelant -> 17 (Bom))
    def __str__(self):
        return f"{self.aluno_gitlabact.handle} → {self.prev_grade} ({self.prev_category})"

    # Para garantir que o estudante só pode ter uma previsão por data
    class Meta:
        unique_together = (("prev_date", "student"),)


# Tabela de associação entre registos de ativadade GitLab e previsões de desempenho
class AlunoGitlabactPrevisao(models.Model):
    aluno_gitlabact = models.ForeignKey(AlunoGitlabAct, on_delete=models.CASCADE)   # conjunto de métricas de atividade de GitLab de um aluno
    previsao = models.ForeignKey(Previsao, on_delete=models.CASCADE)    # previsão feita com base nessa atividade

    # Para garantir que não se criem ligações duplicadas entre a mesma atividade e previsão
    class Meta:
        unique_together = (("aluno_gitlabact", "previsao"),)


# Associação de uma previsão a um grupo - previsão feita para um determinado grupo 
class PrevisaoGrupo(models.Model):
    previsao = models.ForeignKey(Previsao, on_delete=models.CASCADE)    # refere-se á previsão de desempenho de um aluno
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)  # grupo onde a previsão vai ser inserida

    # Para garantir que e mesma previsão não é associada duas vezes ao mesmo grupo
    class Meta:
        unique_together = (("previsao", "grupo"),)


# Para associar um grupo a um projeto
class GrupoProject(models.Model):
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)  # grupo de alunos 
    project = models.ForeignKey(Project, on_delete=models.CASCADE) # repositório do GitLab

    # Pra garantir que não se repetem ligções grupo-projeto
    class Meta:
        unique_together = (("grupo", "project"),)


# Associa um professor a um grupo  
class TeacherGrupo(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)  # professor responsável pelo grupo
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)  # grupo de alunos 

    class Meta:
        unique_together = (("teacher", "grupo"),)