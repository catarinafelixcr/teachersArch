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
    try:
        project_path = repo_url.replace("https://gitlab.com/", "").strip("/")
        return gl.projects.get(project_path)
    except Exception:
        project_name = project_path.split("/")[-1]
        search_results = gl.projects.list(search=project_name)
        for proj in search_results:
            if proj.web_url == repo_url:
                return gl.projects.get(proj.id)
        raise Exception(f"Projeto não encontrado: {repo_url}")

def fetch_students(project, last_commit_date_by_handle, deadline="2025-01-01T00:00:00"):
    from collections import defaultdict

    students = defaultdict(lambda: {
        "total_commits": 0,
        "sum_lines_added": 0,
        "sum_lines_deleted": 0,
        "sum_lines_per_commit": 0,
        "active_days": 0,
        "last_minute_commits": 0,
        "total_merge_requests": 0,
        "merged_requests": 0,
        "review_comments_given": 0,
        "review_comments_received": 0,
        "total_issues_created": 0,
        "total_issues_assigned": 0,
        "issues_resolved": False,
        "issue_participation": False,
        "branches_created": 0,
        "merges_to_main_branch": 0,
    })

    members = project.members.list(all=True)
    for member in members:
        handle = member.username
        students[handle]

    commits = project.commits.list(all=True, get_all=True)
    seen_days = defaultdict(set)

    for commit_summary in commits:
        try:
            commit = project.commits.get(commit_summary.id)
        except Exception as e:
            print(f"Erro ao obter commit {commit_summary.id}: {e}")
            continue

        author = commit.author_email or "unknown"
        handle = author.split("@")[0]
        created_at = commit.created_at

        last_saved_date = last_commit_date_by_handle.get(handle)
        if last_saved_date and datetime.fromisoformat(created_at) <= last_saved_date:
            continue

        students[handle]["total_commits"] += 1
        additions = commit.stats.get("additions", 0) if commit.stats else 0
        deletions = commit.stats.get("deletions", 0) if commit.stats else 0

        students[handle]["sum_lines_added"] += additions
        students[handle]["sum_lines_deleted"] += deletions

        if is_last_minute(created_at, deadline):
            students[handle]["last_minute_commits"] += 1

        day = created_at.split('T')[0]
        seen_days[handle].add(day)

    for handle in seen_days:
        students[handle]["active_days"] = len(seen_days[handle])
        if students[handle]["total_commits"] > 0:
            students[handle]["sum_lines_per_commit"] = students[handle]["sum_lines_added"] // students[handle]["total_commits"]

    return students

def extract_from_gitlab(repo_url, api_key=None, last_commit_date_by_handle=None):
    gl = Gitlab(GITLAB_URL, private_token=api_key or GITLAB_TOKEN)
    project = fetch_project_from_url(gl, repo_url)

    if last_commit_date_by_handle is None:
        last_commit_date_by_handle = {}

    students_data = fetch_students(project, last_commit_date_by_handle)
    return students_data