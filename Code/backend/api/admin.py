# admin.py
from django.contrib import admin
from django.contrib.sites.models import Site

#admin.site.register(Site)

# Mantém os teus registos normais
from .models import *

admin.site.register(Utilizador)
admin.site.register(Teacher)
admin.site.register(Grupo)
admin.site.register(Project)
admin.site.register(AlunoGitlabAct)
admin.site.register(Previsao)
admin.site.register(PrevisaoGrupo)
admin.site.register(GrupoProject)
admin.site.register(TeacherGrupo)
admin.site.register(AlunoGitlabactPrevisao)