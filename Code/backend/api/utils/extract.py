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

# ... (restante código igual ao teu)

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

    members = project.members.list(all=True)
    print("\n🔍 Membros do projeto:")
    for member in members:
        handle = member.username
        print(f"  - {handle}")
        students[handle]

    commits = project.commits.list(all=True, get_all=True)
    seen_days = defaultdict(set)

    print("\n🧾 Commits:")
    for commit_summary in commits:
        try:
            commit = project.commits.get(commit_summary.id)
        except Exception as e:
            print(f"Erro ao obter commit {commit_summary.id}: {e}")
            continue

        author_email = commit.author_email or "unknown"
        handle = author_email.split("@")[0]
        created_at = commit.created_at
        print(f"  → Commit por {handle} em {created_at}")

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

    # Branches
    branch_counts = defaultdict(int)
    branches = project.branches.list(all=True)
    print("\n🌿 Branches:")
    for branch in branches:
        try:
            commit = project.commits.get(branch.commit['id'])
            author_email = commit.author_email or ""
            handle = author_email.split("@")[0]
            print(f"  → Branch '{branch.name}' último commit por {handle}")
            branch_counts[handle] += 1
        except Exception as e:
            print(f"Erro ao processar branch {branch.name}: {e}")
            continue

    for handle in students:
        students[handle]["branches_created"] = branch_counts.get(handle, 0)

    # Merge Requests
    mrs = project.mergerequests.list(all=True, get_all=True)
    print("\n🔀 Merge Requests:")
    for mr in mrs:
        try:
            author = mr.author["username"]
            print(f"  → MR por {author}, estado: {mr.state}")
            students[author]["total_merge_requests"] += 1
            if mr.state == "merged":
                students[author]["merged_requests"] += 1
                if mr.target_branch == "main":
                    students[author]["merges_to_main_branch"] += 1

            notes = mr.notes.list(all=True)
            for note in notes:
                note_author = note.author["username"]
                if note_author == author:
                    students[author]["review_comments_given"] += 1
                else:
                    students[author]["review_comments_received"] += 1
        except Exception as e:
            print(f"Erro em MR: {e}")
            continue

    # Issues
    issues = project.issues.list(all=True, get_all=True)
    print("\n📋 Issues:")
    for issue in issues:
        try:
            author = issue.author["username"]
            print(f"  → Issue por {author}, estado: {issue.state}")
            students[author]["total_issues_created"] += 1
            if issue.state == "closed":
                students[author]["issues_resolved"] = True
            if issue.assignee:
                assignee = issue.assignee["username"]
                print(f"    ↪ atribuída a {assignee}")
                students[assignee]["total_issues_assigned"] += 1
                students[assignee]["issue_participation"] = True
        except Exception as e:
            print(f"Erro em issue: {e}")
            continue

    # 🔍 Print final por aluno:
    print("\nResumo final por estudante:")
    for handle, metrics in students.items():
        print(f"🔸 {handle}: commits={metrics['total_commits']}, MRs={metrics['total_merge_requests']}, issues={metrics['total_issues_created']}, linhas adicionadas={metrics['sum_lines_added']}")

    return students

def extract_from_gitlab(repo_url, api_key=None, last_commit_date_by_handle=None):
    gl = Gitlab(GITLAB_URL, private_token=api_key or GITLAB_TOKEN)
    project = fetch_project_from_url(gl, repo_url)

    if last_commit_date_by_handle is None:
        last_commit_date_by_handle = {}

    students_data = fetch_students(gl, project, last_commit_date_by_handle)

    return students_data
