from gitlab import Gitlab
from collections import defaultdict
from datetime import datetime, timezone
import os


GITLAB_URL = "https://gitlab.com"
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN", 'glpat-z7gzPpe48a5krLoLa4o4')


def is_last_minute(commit_date_str, deadline):
    deadline_dt = datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc)
    commit_dt = datetime.fromisoformat(commit_date_str).replace(tzinfo=timezone.utc)
    return (deadline_dt - commit_dt).days <= 2


def fetch_project_from_url(gl, repo_url):
    """
    Tenta obter o projeto pelo path completo.
    Se falhar, tenta pesquisar pelo nome do projeto.
    """
    try:
        project_path = repo_url.replace("https://gitlab.com/", "").strip("/")
        return gl.projects.get(project_path)
    except Exception as e:
        print(f"Falha ao obter projeto direto: {e}")
        project_name = project_path.split("/")[-1]
        print(f"A tentar procurar por nome: {project_name}")

        search_results = gl.projects.list(search=project_name)
        for proj in search_results:
            if proj.web_url == repo_url:
                print(f"Projeto encontrado via pesquisa: {proj.name_with_namespace}")
                return gl.projects.get(proj.id)

        raise Exception(f"Projeto não encontrado: {repo_url}")


def fetch_students(project, deadline="2025-01-01T00:00:00"):
    commits = project.commits.list(all=True, get_all=True)
    students = defaultdict(lambda: {
        "total_commits": 0,
        "last_minute_commits": 0,
    })

    for commit in commits:
        author = commit.author_email or "unknown"
        handle = author.split("@")[0]
        created_at = commit.created_at
        students[handle]["total_commits"] += 1
        if is_last_minute(created_at, deadline):
            students[handle]["last_minute_commits"] += 1

    return students

def extract_from_gitlab(repo_url):
    gl = Gitlab(GITLAB_URL, private_token=GITLAB_TOKEN)
    project = fetch_project_from_url(gl, repo_url)
    students_data = fetch_students(project)
    return students_data
