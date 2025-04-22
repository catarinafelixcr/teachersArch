# --- Imports ---
import random
from datetime import date, timedelta
from django.contrib.auth.hashers import make_password
from api.models import Utilizador, Teacher, Grupo, Project, AlunoGitlabAct, Previsao, AlunoGitlabactPrevisao, PrevisaoGrupo, GrupoProject, TeacherGrupo

# --- Limpeza Opcional (CUIDADO: Apaga dados existentes!) ---
# Descomenta as linhas abaixo se quiseres começar com uma BD limpa.
# print("A limpar dados antigos...")
# TeacherGrupo.objects.all().delete()
# GrupoProject.objects.all().delete()
# AlunoGitlabactPrevisao.objects.all().delete()
# PrevisaoGrupo.objects.all().delete()
# Previsao.objects.all().delete()
# AlunoGitlabAct.objects.all().delete()
# Teacher.objects.all().delete()
# Utilizador.objects.all().delete() # Utilizadores alunos e professores
# Grupo.objects.all().delete()
# Project.objects.all().delete()
# print("Limpeza concluída.")

# --- Criação de Professores ---
print("A criar professores...")
try:
    u_teacher1 = Utilizador.objects.create(
        name="Catarina Félix Cruz",
        email="catafcruz02@gmail.com",
        password=make_password("catcatcat3"), # Hash da password
        is_active=True,
        last_login=None # Pode ser atualizado no login real
    )
    teacher1 = Teacher.objects.create(
        utilizador=u_teacher1,
        link_gitlab="https://gitlab.com/prof_catatau_example"
    )
    print(f"Professor '{u_teacher1.name}' criado.")
except Exception as e:
    print(f"Erro ao criar Professor Catatau (pode já existir): {e}")
    u_teacher1 = Utilizador.objects.get(email="catafcruz02@gmail.com")
    teacher1, created = Teacher.objects.get_or_create(utilizador=u_teacher1, defaults={'link_gitlab': "https://gitlab.com/prof_catatau_example"})


try:
    u_teacher2 = Utilizador.objects.create(
        name="Professora Ana",
        email="ana.prof@example.com",
        password=make_password("password123"),
        is_active=True
    )
    teacher2 = Teacher.objects.create(
        utilizador=u_teacher2,
        link_gitlab="https://gitlab.com/prof_ana_example"
    )
    print(f"Professor '{u_teacher2.name}' criado.")
except Exception as e:
    print(f"Erro ao criar Professora Ana (pode já existir): {e}")
    u_teacher2 = Utilizador.objects.get(email="ana.prof@example.com")
    teacher2, created = Teacher.objects.get_or_create(utilizador=u_teacher2, defaults={'link_gitlab': "https://gitlab.com/prof_ana_example"})

# --- Criação de Grupos ---
print("A criar grupos...")
group_a, _ = Grupo.objects.get_or_create(group_name="Turma A - LP1 2023/24")
group_b, _ = Grupo.objects.get_or_create(group_name="Turma B - LP1 2023/24")
group_c, _ = Grupo.objects.get_or_create(group_name="Projeto Final - 2024") # Grupo da Prof. Ana
print(f"Grupos '{group_a.group_name}', '{group_b.group_name}', '{group_c.group_name}' criados/obtidos.")

# --- Criação de Projetos ---
print("A criar projetos...")
proj1, _ = Project.objects.get_or_create(repo_url="https://gitlab.example.com/lp1_2023_24/projeto_base")
proj2, _ = Project.objects.get_or_create(repo_url="https://gitlab.example.com/projeto_final_2024/main_repo")
print(f"Projetos '{proj1.repo_url}', '{proj2.repo_url}' criados/obtidos.")

# --- Associações Professor <-> Grupo ---
print("A associar professores a grupos...")
TeacherGrupo.objects.get_or_create(teacher=teacher1, grupo=group_a)
TeacherGrupo.objects.get_or_create(teacher=teacher1, grupo=group_b)
TeacherGrupo.objects.get_or_create(teacher=teacher2, grupo=group_c) # Prof Ana com Grupo C
print("Associações Professor-Grupo criadas.")

# --- Associações Grupo <-> Projeto ---
print("A associar grupos a projetos...")
GrupoProject.objects.get_or_create(grupo=group_a, project=proj1)
GrupoProject.objects.get_or_create(grupo=group_b, project=proj1) # Mesmo projeto para Turma A e B
GrupoProject.objects.get_or_create(grupo=group_c, project=proj2)
print("Associações Grupo-Projeto criadas.")

# --- Criação de Alunos e Atividade GitLab ---
print("A criar alunos e dados de atividade...")
alunos_criados = []
# Alunos para Grupo A (Professor Catatau)
student_data_a = [
    {"name": "Alice Silva", "email": "alice@student.example.com", "num": 2023001, "risk": False, "commits": 150, "active": 45},
    {"name": "Bruno Costa", "email": "bruno@student.example.com", "num": 2023002, "risk": True, "commits": 80, "active": 30},
    {"name": "Catarina Martins", "email": "catarina@student.example.com", "num": 2023003, "risk": False, "commits": 120, "active": 40},
]
# Alunos para Grupo B (Professor Catatau)
student_data_b = [
    {"name": "Diogo Ferreira", "email": "diogo@student.example.com", "num": 2023004, "risk": False, "commits": 210, "active": 55},
    {"name": "Eva Gomes", "email": "eva@student.example.com", "num": 2023005, "risk": True, "commits": 50, "active": 25},
]
# Alunos para Grupo C (Professora Ana)
student_data_c = [
    {"name": "Filipe Alves", "email": "filipe@student.example.com", "num": 2024001, "risk": False, "commits": 180, "active": 50},
]

def criar_aluno_atividade(data, grupo):
    try:
        u_student = Utilizador.objects.create(
            name=data['name'],
            email=data['email'],
            password=make_password("studentpass"), # Password genérica para alunos
            is_active=True
        )
    except Exception as e:
        print(f"Aluno com email {data['email']} pode já existir. Tentando obter...")
        u_student = Utilizador.objects.get(email=data['email'])

    aga, created = AlunoGitlabAct.objects.get_or_create(
        utilizador=u_student,
        student_num=data['num'],
        group=grupo,
        defaults={
            'mention_handle': random.choice([True, False]),
            'interval': random.choice([True, False, None]),
            'total_commits': data['commits'],
            'sum_lines_added': data['commits'] * random.randint(15, 40),
            'sum_lines_deleted': data['commits'] * random.randint(5, 20),
            'sum_lines_per_commit': random.randint(10, 50),
            'active_days': data['active'],
            'last_minute_commits': data.get('risk', False), # Exemplo: risco correlacionado com last minute
            'total_merge_requests': data['commits'] // random.randint(8, 15) if data['commits'] > 0 else 0,
            'merged_requests': lambda tr=data['commits'] // random.randint(8, 15) if data['commits'] > 0 else 0: max(0, tr - random.randint(0, 2))(), # Chamada da lambda
            'review_comments_given': random.randint(0, 50),
            'review_comments_received': random.randint(0, 30),
            'total_issues_created': random.randint(0, 10),
            'total_issues_assigned': random.randint(0, 15),
            'issues_resolved': random.choice([True, False]),
            'issue_participation': random.choice([True, False]),
            'branches_created': data['commits'] // random.randint(5, 10) if data['commits'] > 0 else 0,
            'merges_to_main_branch': lambda bc=data['commits'] // random.randint(5, 10) if data['commits'] > 0 else 0: max(0, bc - random.randint(0, 5))() # Chamada da lambda
        }
    )
    if created:
        print(f"  Aluno '{u_student.name}' e Atividade criados para Grupo '{grupo.group_name}'.")
    else:
        print(f"  Atividade para Aluno '{u_student.name}' no Grupo '{grupo.group_name}' já existia.")
    return u_student, aga, data['risk'] # Retorna o utilizador, a atividade e o risco definido

for data in student_data_a:
    alunos_criados.append(criar_aluno_atividade(data, group_a))
for data in student_data_b:
    alunos_criados.append(criar_aluno_atividade(data, group_b))
for data in student_data_c:
    alunos_criados.append(criar_aluno_atividade(data, group_c))

print("Criação de alunos e atividades concluída.")

# --- Criação de Previsões ---
print("A criar previsões...")
today = date.today()
previsoes_criadas = []

for u_student, aga, risk in alunos_criados:
    # Previsão 1 (mais antiga)
    prev_date1 = today - timedelta(days=random.randint(25, 35))
    prev_grade1 = random.randint(6, 18)
    faling_risk1 = risk if random.random() < 0.7 else random.choice([True, False]) # Usa o risco definido ou aleatório
    if prev_grade1 < 10: faling_risk1 = True # Garante risco se nota < 10
    if prev_grade1 > 13: faling_risk1 = False # Garante não risco se nota > 13

    p1, c1 = Previsao.objects.get_or_create(
        student=u_student,
        prev_date=prev_date1,
        defaults={
            'prev_category': "Avaliação Intercalar",
            'prev_grade': prev_grade1,
            'faling_risk': faling_risk1,
        }
    )
    if c1:
        previsoes_criadas.append(p1)
        AlunoGitlabactPrevisao.objects.get_or_create(aluno_gitlabact=aga, previsao=p1)
        PrevisaoGrupo.objects.get_or_create(previsao=p1, grupo=aga.group)

    # Previsão 2 (mais recente)
    prev_date2 = today - timedelta(days=random.randint(1, 5))
    # Tenta mostrar alguma evolução na nota
    prev_grade2 = min(20, max(0, prev_grade1 + random.randint(-2, 3)))
    faling_risk2 = risk # Risco atual baseado no definido
    if prev_grade2 < 10: faling_risk2 = True
    if prev_grade2 >= 10: faling_risk2 = False # Atualiza risco com base na nota mais recente

    p2, c2 = Previsao.objects.get_or_create(
        student=u_student,
        prev_date=prev_date2,
        defaults={
            'prev_category': "Estimativa Final",
            'prev_grade': prev_grade2,
            'faling_risk': faling_risk2,
        }
    )
    if c2:
        previsoes_criadas.append(p2)
        AlunoGitlabactPrevisao.objects.get_or_create(aluno_gitlabact=aga, previsao=p2)
        PrevisaoGrupo.objects.get_or_create(previsao=p2, grupo=aga.group)

    if c1 or c2:
         print(f"  Previsões criadas/obtidas para {u_student.name}.")

print(f"Criação de {len(previsoes_criadas)} previsões concluída.")

print("\n--- Dados de Exemplo Criados ---")
print(f"Total Utilizadores: {Utilizador.objects.count()}")
print(f"Total Professores: {Teacher.objects.count()}")
print(f"Total Grupos: {Grupo.objects.count()}")
print(f"Total Projetos: {Project.objects.count()}")
print(f"Total AlunoGitlabAct: {AlunoGitlabAct.objects.count()}")
print(f"Total Previsões: {Previsao.objects.count()}")
print(f"Total TeacherGrupo: {TeacherGrupo.objects.count()}")
print(f"Total GrupoProject: {GrupoProject.objects.count()}")
print(f"Total AlunoGitlabactPrevisao: {AlunoGitlabactPrevisao.objects.count()}")
print(f"Total PrevisaoGrupo: {PrevisaoGrupo.objects.count()}")
