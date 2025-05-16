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


def get_unique_id(name="", email=""):
    if name:
        return name.strip().lower().replace(" ", "").replace(".", "")
    if email:
        return email.strip().split("@")[0].lower()
    return "unknown"


def merge_metrics(target, source):
    for key in target:
        if isinstance(target[key], int) and isinstance(source[key], int):
            target[key] += source[key]
        elif isinstance(target[key], bool) and isinstance(source[key], bool):
            target[key] = target[key] or source[key]


def fetch_students(gl, project, last_commit_date_by_handle, deadline="2025-01-01T00:00:00"):
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

    seen_days = defaultdict(set)

    print("\n🧾 Commits:")
    for commit_summary in project.commits.list(all=True, get_all=True):
        try:
            commit = project.commits.get(commit_summary.id)
        except Exception as e:
            print(f"Erro ao obter commit {commit_summary.id}: {e}")
            continue

        author_email = commit.author_email or ""
        author_name = commit.author_name or ""
        handle = get_unique_id(author_name, author_email)
        created_at = commit.created_at

        last_saved_date = last_commit_date_by_handle.get(handle)
        if last_saved_date and datetime.fromisoformat(created_at) <= last_saved_date:
            continue

        stats = commit.stats or {}
        students[handle]["total_commits"] += 1
        students[handle]["sum_lines_added"] += stats.get("additions", 0)
        students[handle]["sum_lines_deleted"] += stats.get("deletions", 0)

        if is_last_minute(created_at, deadline):
            students[handle]["last_minute_commits"] += 1

        seen_days[handle].add(created_at.split('T')[0])

    for handle in seen_days:
        students[handle]["active_days"] = len(seen_days[handle])
        if students[handle]["total_commits"] > 0:
            students[handle]["sum_lines_per_commit"] = (
                students[handle]["sum_lines_added"] // students[handle]["total_commits"]
            )

    # Branches
    for branch in project.branches.list(all=True):
        try:
            commit = project.commits.get(branch.commit['id'])
            handle = get_unique_id(commit.author_name, commit.author_email)
            students[handle]["branches_created"] += 1
        except Exception:
            continue

    # Merge Requests
    for mr in project.mergerequests.list(all=True, get_all=True):
        try:
            handle = get_unique_id(mr.author.get("name", ""), mr.author.get("public_email", ""))
            students[handle]["total_merge_requests"] += 1
            if mr.state == "merged":
                students[handle]["merged_requests"] += 1
                if mr.target_branch == "main":
                    students[handle]["merges_to_main_branch"] += 1

            for note in mr.notes.list(all=True):
                note_handle = get_unique_id(note.author.get("name", ""), note.author.get("public_email", ""))
                if note_handle == handle:
                    students[handle]["review_comments_given"] += 1
                else:
                    students[note_handle]["review_comments_received"] += 1
        except Exception:
            continue

    # Issues
    for issue in project.issues.list(all=True, get_all=True):
        try:
            handle = get_unique_id(issue.author.get("name", ""), issue.author.get("public_email", ""))
            students[handle]["total_issues_created"] += 1
            if issue.state == "closed":
                students[handle]["issues_resolved"] = True
            if issue.assignee:
                assignee = get_unique_id(issue.assignee.get("name", ""), issue.assignee.get("public_email", ""))
                students[assignee]["total_issues_assigned"] += 1
                students[assignee]["issue_participation"] = True
        except Exception:
            continue

    # 🔄 Unificação por substrings
    print("\n📘 Unificando estudantes semelhantes por substrings...")
    unified = {}
    used = set()
    all_handles = sorted(students.keys(), key=len)  # começa pelos nomes mais curtos

    for i, base in enumerate(all_handles):
        if base in used:
            continue
        merged = students[base].copy()
        used.add(base)

        for j in range(i + 1, len(all_handles)):
            candidate = all_handles[j]
            if candidate in used:
                continue
            if base in candidate or candidate in base:
                merge_metrics(merged, students[candidate])
                used.add(candidate)

        unified[base] = merged

    # 🔍 Resultado final
    print("\n✅ Resumo unificado por estudante:")
    for handle, data in unified.items():
        print(f"🔸 {handle}: commits={data['total_commits']}, MRs={data['total_merge_requests']}, issues={data['total_issues_created']}, linhas adicionadas={data['sum_lines_added']}")

    return unified


def extract_from_gitlab(repo_url, api_key=None, last_commit_date_by_handle=None):
    gl = Gitlab(GITLAB_URL, private_token=api_key or GITLAB_TOKEN)
    project = fetch_project_from_url(gl, repo_url)

    if last_commit_date_by_handle is None:
        last_commit_date_by_handle = {}

    return fetch_students(gl, project, last_commit_date_by_handle)
