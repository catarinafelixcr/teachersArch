from gitlab import Gitlab
from collections import defaultdict
from statistics import mean
import datetime
import csv
import os
from datetime import datetime, timezone

gitlab_url = "https://gitlab.com"
gitlab_token = os.getenv("GITLAB_TOKEN", 'glpat-z7gzPpe48a5krLoLa4o4')

project_ids = [61760884, 61760973, 61760822, 61708094, 61760919, 61708152, 61708114, 61708087,
               50521584, 50554251, 50554274, 50554307, 50554328, 50554344, 50479247, 50554382]

start_date = datetime(2022, 2, 1).isoformat()
end_date = datetime(2025, 1, 1).isoformat()

def is_last_minute(commit_date_str, deadline="2024-12-31T23:59:59"):
    deadline_dt = datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc)
    commit_dt = datetime.fromisoformat(commit_date_str)
    if commit_dt.tzinfo is None:
        commit_dt = commit_dt.replace(tzinfo=timezone.utc)
    return (deadline_dt - commit_dt).days <= 2

def get_user_email(gl, user_id):
    try:
        user = gl.users.get(user_id)
        return user.email
    except Exception as e:
        print(f"Erro ao obter e-mail do usuário {user_id}: {e}")
        return None

def main():
    gl = Gitlab(gitlab_url, private_token=gitlab_token)
    for pid in project_ids:
        print(f"\n🔍 Processando projeto ID: {pid}")
        try:
            project = gl.projects.get(pid)
            commits = fetch_gitlab_commits(project)
            mrs = fetch_gitlab_merge_requests(project, gl)
            for mr in mrs:
                mr["project_id"] = pid
            issues = fetch_gitlab_issues(project, gl)
            for issue in issues:
                issue["project_id"] = pid

            branches = fetch_gitlab_branches(project)
            for branch in branches:
                branch["project_id"] = pid
            
            student_metrics = aggregate_all_features(commits, mrs, issues, branches, gl)
            save_metrics_to_csv({pid: student_metrics}, filename=f"project_{pid}.csv")

        except Exception as e:
            print(f"Erro ao processar projeto {pid}: {e}")

def fetch_gitlab_commits(project):
    commits = project.commits.list(since=start_date, until=end_date, iterator=True)
    commits_data = []
    commit_count = 0

    for commit in commits:
        commit_count += 1
        try:
            detailed_commit = project.commits.get(commit.id)
            stats = detailed_commit.stats
            commits_data.append({
                "project_id": project.id,
                "author_id": detailed_commit.author_email,  # Usar ID ou e-mail como identificador único
                "author_name": detailed_commit.author_name,
                "author_email": detailed_commit.author_email,
                "created_at": detailed_commit.created_at,
                "lines_added": stats['additions'],
                "lines_deleted": stats['deletions'],
                "lines_changed": stats['additions'] + stats['deletions'],
                "last_minute": is_last_minute(detailed_commit.created_at)
            })
        except Exception as e:
            print(f"Erro ao obter detalhes do commit {commit.id}: {e}")

    print(f"  → {commit_count} commits encontrados")
    return commits_data

def count_comments_given_by_user(project, mr, gl):
    comments = mr.notes.list(get_all=True)
    authors = defaultdict(int)
    for comment in comments:
        if comment.author and 'id' in comment.author:
            author_id = comment.author['id']  # Agora usando ID para evitar duplicatas
            authors[author_id] += 1
    return authors  # Retorna {user_id: count}

def fetch_gitlab_merge_requests(project, gl):
    mrs = project.mergerequests.list(state='all', created_after=start_date, created_before=end_date, iterator=True)
    #print(f"  → Merge requests encontrados (contagem aproximada): {len(list(mrs))}")
    mrs_list = list(mrs)
    print(f"  → {len(mrs_list)} merge requests encontrados")
    mrs_data = []
    for mr in mrs:
        try:
            author_id = mr.author['id']
            author_email = get_user_email(gl, author_id)
            mrs_data.append({
                "author_id": author_id,
                "author_name": mr.author['name'],
                "author_email": author_email,
                "created_at": mr.created_at,
                "state": mr.state,
                "merged": mr.merged_at is not None,
                "review_comments_received": len(mr.notes.list(get_all=True)),
                "review_comments_given": count_comments_given_by_user(project, mr, gl)
            })
        except KeyError as e:
            print(f"Erro ao processar MR {mr.id}: {e}")
    return mrs_data

def fetch_gitlab_branches(project):
    branches = project.branches.list(get_all=True)
    return [{
        "branch_name": branch.name,
        # ATENÇÃO: O autor é o do último commit, não necessariamente o criador da branch!
        "author_id": branch.commit["author_email"],  # Usar ID/e-mail como identificador único
        "author_name": branch.commit["author_name"],
        "created_at": branch.commit["created_at"],
        "merged_to_main": branch.merged
    } for branch in branches]

def fetch_gitlab_issues(project, gl):
    issues = project.issues.list(state='all', created_after=start_date, created_before=end_date, iterator=True)
    issues_data = []
    for issue in issues:
        try:
            author_id = issue.author['id']
            author_email = get_user_email(gl, author_id)
            assignee = issue.assignee
            assignee_id = assignee['id'] if assignee else None
            issues_data.append({
                "author_id": author_id,
                "author_name": issue.author['name'],
                "author_email": author_email,
                "created_at": issue.created_at,
                "state": issue.state,
                "assignee_id": assignee_id,
                "assignee_name": assignee['name'] if assignee else None,
                "resolved": issue.state == "closed",
                "comments": len(issue.notes.list(get_all=True)),
                "participants": list(set([n.author['id'] for n in issue.notes.list(get_all=True)]))  # Usar IDs
            })
        except KeyError as e:
            print(f"Erro ao processar Issue {issue.id}: {e}")
    print(f"  → {len(issues_data)} issues encontrados")
    return issues_data

def aggregate_all_features(commits, merge_requests, issues, branches, gl):
    features = defaultdict(lambda: {
        "project_id": "",
        "student_id": "",  # Identificador único
        "student_name": "",
        "student_email": "",
        "group_id": "",
        "total_commits": 0,
        "avg_lines_per_commit": 0,
        "avg_lines_added": 0,
        "avg_lines_deleted": 0,
        "active_days": 0,
        "last_minute_commits": 0,
        "total_merge_requests": 0,
        "merged_requests": 0,
        "review_comments_received": 0,
        "review_comments_given": 0,
        "total_issues_created": 0,
        "total_issues_assigned": 0,
        "issues_resolved": 0,
        "issue_participation": 0,
        "branches_created": 0,
        "branches_merged_to_main": 0
    })

    # Processar commits (agora usando author_id)
    commit_lines_added = defaultdict(list)
    commit_lines_deleted = defaultdict(list)
    commit_dates_by_user = defaultdict(set)

    for commit in commits:
        user_id = commit["author_id"]
        features[user_id]["student_id"] = user_id
        features[user_id]["student_name"] = commit["author_name"]
        features[user_id]["student_email"] = commit["author_email"]
        features[user_id]["total_commits"] += 1
        features[user_id]["last_minute_commits"] += int(commit["last_minute"])
        commit_lines_added[user_id].append(commit["lines_added"])
        commit_lines_deleted[user_id].append(commit["lines_deleted"])
        commit_dates_by_user[user_id].add(commit["created_at"][:10])

    # Calcular médias
    for user_id in commit_lines_added:
        features[user_id]["avg_lines_per_commit"] = mean(
            [a + b for a, b in zip(commit_lines_added[user_id], commit_lines_deleted[user_id])])
        features[user_id]["avg_lines_added"] = mean(commit_lines_added[user_id])
        features[user_id]["avg_lines_deleted"] = mean(commit_lines_deleted[user_id])
        features[user_id]["active_days"] = len(commit_dates_by_user[user_id])

    # Processar merge requests (usando author_id)
    for mr in merge_requests:
        user_id = mr["author_id"]
        if not features[user_id]["student_email"] and mr["author_email"]:
            features[user_id]["student_email"] = mr["author_email"]
        features[user_id]["total_merge_requests"] += 1
        if mr["merged"]:
            features[user_id]["merged_requests"] += 1
        features[user_id]["review_comments_received"] += mr["review_comments_received"]
        for commenter_id, count in mr["review_comments_given"].items():
            features[commenter_id]["review_comments_given"] += count

    # Processar issues (usando author_id)
    for issue in issues:
        user_id = issue["author_id"]
        if not features[user_id]["student_email"] and issue["author_email"]:
            features[user_id]["student_email"] = issue["author_email"]
        features[user_id]["total_issues_created"] += 1
        if issue["assignee_id"]:
            features[issue["assignee_id"]]["total_issues_assigned"] += 1
        if issue["resolved"]:
            features[user_id]["issues_resolved"] += 1
        for participant_id in issue["participants"]:
            features[participant_id]["issue_participation"] += 1

    # Processar branches (usando author_id)
    for branch in branches:
        user_id = branch["author_id"]
        features[user_id]["branches_created"] += 1
        if branch["merged_to_main"]:
            features[user_id]["branches_merged_to_main"] += 1

    return features

def save_metrics_to_csv(data, filename="gitlab_activity.csv"):
    header = [
        "project_id", "group_id", "student_id", "student_name", "student_email",
        "total_commits", "avg_lines_added", "avg_lines_deleted", "avg_lines_per_commit",
        "active_days", "last_minute_commits",
        "total_merge_requests", "merged_requests",
        "review_comments_given", "review_comments_received",
        "total_issues_created", "total_issues_assigned", "issues_resolved", "issue_participation",
        "branches_created", "branches_merged_to_main"
    ]

    for pid, students in data.items():
        if not students:
            print(f"Sem métricas para o projeto {pid}.")
            continue

        with open(filename, mode="w", newline='', encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(header)
            for student_id, metrics in students.items():
                row = [
                    pid,
                    metrics.get("group_id", ""),
                    student_id,
                    metrics.get("student_name", ""),
                    metrics.get("student_email", "")
                ]
                row += [metrics.get(col, "") for col in header[5:]]
                writer.writerow(row)

        print(f"Dados guardados em: {filename}")

if __name__ == "__main__":
    main()