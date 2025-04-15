from django.db import models
from uuid import uuid4
from django.contrib.auth.hashers import make_password

class Utilizador(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=512, null=True, blank=True)
    password = models.CharField(max_length=512)
    email = models.CharField(max_length=512, unique=True)
    is_active = models.BooleanField(default=False)  # ADICIONEI AQUI --> se o prof confirmou o email --> permite bloquear o acesso até o utilizador confirmar o registo
    activation_token = models.CharField(max_length=128, blank=True, null=True, unique=True)  # E AQUI!! --> usado para gerar o link de verificação. Depois de ativar, é removido
    last_login = models.DateTimeField(null=True, blank=True) # ADICIONEI AQUI --> para guardar a data do último login do utilizador

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def get_email_field_name(self):
        return 'email'
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password) 

class Teacher(models.Model):
    id = models.AutoField(primary_key=True)
    utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, unique=True, null=True, blank=True)
    teacher_name = models.CharField(max_length=512, null=True, blank=True)
    link_gitlab = models.CharField(max_length=512, unique=True, null=True, blank=True)

class Grupo(models.Model):
    group_id = models.BigIntegerField(primary_key=True)
    group_name = models.CharField(max_length=512, unique=True)

class Project(models.Model):
    project_id = models.BigIntegerField(primary_key=True)

class AlunoGitlabAct(models.Model):
    utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, primary_key=True)
    student_email = models.CharField(max_length=512,null=True, blank=True)
    group = models.ForeignKey(Grupo, on_delete=models.CASCADE, null=True, blank=True)  
    gitlabact_total_commits = models.BigIntegerField()
    gitlabact_avg_lines_added = models.BigIntegerField()
    gitlabact_avg_lines_deleted = models.BigIntegerField()
    gitlabact_avg_lines_per_commit = models.BigIntegerField()
    gitlabact_active_days = models.BigIntegerField()
    gitlabact_last_minute_commits = models.BigIntegerField()
    gitlabact_total_merge_requests = models.BigIntegerField()
    gitlabact_merged_requests = models.BigIntegerField()
    gitlabact_review_comments_given = models.BigIntegerField()
    gitlabact_review_comments_received = models.BigIntegerField()
    gitlabact_total_issues_created = models.BigIntegerField()
    gitlabact_total_issues_assigned = models.BigIntegerField()
    gitlabact_issues_resolved = models.BigIntegerField()
    gitlabact_issue_participation = models.BigIntegerField()
    gitlabact_branches_created = models.BigIntegerField()
    gitlabact_merges_to_main_branch = models.BigIntegerField()

    class Meta:
        unique_together = (("student_email", "group"),)

class Previsao(models.Model):
    id = models.AutoField(primary_key=True)
    previsao_id = models.BigIntegerField()
    student = models.ForeignKey(Utilizador, on_delete=models.CASCADE,null=True, blank=True)
    prev_categoria = models.CharField(max_length=255, null=True, blank=True)
    nota_prevista = models.BigIntegerField()
    risco_reprovar = models.BooleanField()
    data_previsao = models.DateField(unique=True)

    class Meta:
        unique_together = (("previsao_id", "student"),)

class PrevisaoGrupo(models.Model):
    previsao = models.ForeignKey(Previsao, on_delete=models.CASCADE)
    group = models.OneToOneField(Grupo, on_delete=models.CASCADE)

class GrupoProject(models.Model):
    group = models.ForeignKey(Grupo, on_delete=models.CASCADE, null=True, blank=True)
    project = models.OneToOneField(Project, on_delete=models.CASCADE)

class TeacherGrupo(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    group = models.ForeignKey(Grupo, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = (("teacher", "group"),)

class AlunoGitlabactPrevisao(models.Model):
    aluno_gitlabact = models.OneToOneField(AlunoGitlabAct, on_delete=models.CASCADE, primary_key=True)
    previsao = models.ForeignKey(Previsao, on_delete=models.CASCADE)
