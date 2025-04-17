from django.db import models
from django.contrib.auth.hashers import make_password

class Utilizador(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=512, null=True, blank=True)
    password = models.CharField(max_length=512)
    email = models.CharField(max_length=512, unique=True)
    is_active = models.BooleanField(default=False)
    activation_token = models.CharField(max_length=128, blank=True, null=True, unique=True)
    last_login = models.DateTimeField(null=True, blank=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

class Teacher(models.Model):
    utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, primary_key=True)
    link_gitlab = models.CharField(max_length=512, unique=True)

class Grupo(models.Model):
    group_id = models.BigAutoField(primary_key=True)
    group_name = models.CharField(max_length=512, unique=True)

class Project(models.Model):
    project_id = models.BigAutoField(primary_key=True)
    repo_url = models.CharField(max_length=512)

class AlunoGitlabAct(models.Model):
    utilizador = models.OneToOneField(Utilizador, on_delete=models.CASCADE, primary_key=True)
    student_num = models.BigIntegerField()
    group = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    mention_handle = models.BooleanField()
    interval = models.BooleanField(null=True, blank=True)
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
        unique_together = (
            ("student_num", "group"),
        )

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
