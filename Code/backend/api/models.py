from django.db import models

class Utilizador(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=512, null=True, blank=True)
    password = models.CharField(max_length=512, unique=True)
    email = models.CharField(max_length=512)

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
