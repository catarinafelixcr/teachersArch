from gitlab import Gitlab
from collections import defaultdict
from statistics import mean
import datetime
import csv
import os
from datetime import datetime, timezone

gitlab_url = "https://gitlab.com"
gitlab_token = os.getenv("GITLAB_TOKEN", 'glpat-z7gzPpe48a5krLoLa4o4')

project_ids = [
    #61760884, 61760973, 61760822, 61708094, 61760919, 61708152,
    61708114, 61708087,
    50521584, 50554251, 50554274, 50554307, 50554328, 50554344, 50479247, 50554382
]

start_date = datetime(2022, 2, 1).isoformat()
end_date = datetime(2025, 1, 1).isoformat()

def is_last_minute(commit_date_str, deadline="2024-12-31T23:59:59"):
    deadline_dt = datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc)
    commit_dt = datetime.fromisoformat(commit_date_str)
    if commit_dt.tzinfo is None:
        commit_dt = commit_dt.replace(tzinfo=timezone.utc)
    return (deadline_dt - commit_dt).days <= 2

def main():
    gl = Gitlab(gitlab_url, private_token=gitlab_token)
    for pid in project_ids:
        print(f"\n🔍 Processando projeto ID: {pid}")
        try:
            project = gl.projects.get(pid)
            commits = fetch_gitlab_commits(project)
            mrs = fetch_gitlab_merge_requests(project)
            for mr in mrs:
                mr["project_id"] = pid
            issues = fetch_gitlab_issues(project)
            for issue in issues:
                issue["project_id"] = pid

            student_metrics = aggregate_all_features(commits, mrs, issues)
            save_metrics_to_csv({pid: student_metrics}, filename=f"project_{pid}.csv")

        except Exception as e:
            print(f"❌ Erro ao processar projeto {pid}: {e}")

def fetch_gitlab_commits(project):
    commits = project.commits.list(since=start_date, until=end_date, all=True, get_all=True)
    print(f"  → {len(commits)} commits encontrados")
    commits_data = []

    for commit in commits:
        try:
            detailed_commit = project.commits.get(commit.id)
            stats = detailed_commit.stats
            commits_data.append({
                "project_id": project.id,
                "author_name": detailed_commit.author_name,
                "author_email": detailed_commit.author_email,
                "created_at": detailed_commit.created_at,
                "lines_added": stats['additions'],
                "lines_deleted": stats['deletions'],
                "lines_changed": stats['additions'] + stats['deletions'],
                "last_minute": is_last_minute(detailed_commit.created_at)
            })
        except Exception as e:
            print(f"⚠ Erro ao obter detalhes do commit {commit.id}: {e}")
    return commits_data

def count_comments_given_by_user(project, mr):
    comments = mr.notes.list(get_all=True)
    authors = defaultdict(int)
    for comment in comments:
        if comment.author and 'name' in comment.author:
            authors[comment.author['name']] += 1
    return dict(authors)

def fetch_gitlab_merge_requests(project):
    mrs = project.mergerequests.list(state='all', created_after=start_date, created_before=end_date, all=True, get_all=True)
    print(f"  → {len(mrs)} merge requests encontrados")
    return [{
        "author_name": mr.author['name'],
        "created_at": mr.created_at,
        "state": mr.state,
        "merged": mr.merged_at is not None,
        "review_comments_received": len(mr.notes.list(get_all=True)),
        "review_comments_given": count_comments_given_by_user(project, mr)
    } for mr in mrs]

def fetch_gitlab_issues(project):
    issues = project.issues.list(state='all', created_after=start_date, created_before=end_date, all=True, get_all=True)
    print(f"  → {len(issues)} issues encontrados")
    return [{
        "author_name": issue.author['name'],
        "created_at": issue.created_at,
        "state": issue.state,
        "assignee": issue.assignee['name'] if issue.assignee else None,
        "resolved": issue.state == "closed",
        "comments": len(issue.notes.list(get_all=True)),
        "participants": list(set([n.author['name'] for n in issue.notes.list(get_all=True)]))
    } for issue in issues]

def aggregate_all_features(commits, merge_requests, issues):
    features = defaultdict(lambda: {
        "project_id":"",
        "student":"",
        "student_email": "",
        "group_id": "",  # Pode ser preenchido manualmente ou por outro sistema
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
        "issue_participation": 0
    })

    commit_lines_added = defaultdict(list)
    commit_lines_deleted = defaultdict(list)
    commit_dates_by_user = defaultdict(set)
    user_emails = {}

    for commit in commits:
        user = commit["author_name"]
        features[user]["student_email"] = commit["author_email"]
        features[user]["total_commits"] += 1
        features[user]["last_minute_commits"] += int(commit["last_minute"])
        commit_lines_added[user].append(commit["lines_added"])
        commit_lines_deleted[user].append(commit["lines_deleted"])
        commit_dates_by_user[user].add(commit["created_at"][:10])
        user_emails[user] = commit["author_email"]

    for user in commit_lines_added:
        features[user]["avg_lines_per_commit"] = mean([a + b for a, b in zip(commit_lines_added[user], commit_lines_deleted[user])])
        features[user]["avg_lines_added"] = mean(commit_lines_added[user])
        features[user]["avg_lines_deleted"] = mean(commit_lines_deleted[user])
        features[user]["active_days"] = len(commit_dates_by_user[user])

    for mr in merge_requests:
        user = mr["author_name"]
        features[user]["total_merge_requests"] += 1
        if mr["merged"]:
            features[user]["merged_requests"] += 1
        features[user]["review_comments_received"] += mr["review_comments_received"]
        for commenter, count in mr["review_comments_given"].items():
            features[commenter]["review_comments_given"] += count

    for issue in issues:
        creator = issue["author_name"]
        features[creator]["total_issues_created"] += 1
        if issue["assignee"]:
            features[issue["assignee"]]["total_issues_assigned"] += 1
        if issue["resolved"]:
            features[creator]["issues_resolved"] += 1
        for participant in issue["participants"]:
            features[participant]["issue_participation"] += 1

    return features

def save_metrics_to_csv(data, filename="gitlab_activity.csv"):
    header = [
        "project_id", "group_id", "student", "student_email",
        "total_commits", "avg_lines_added", "avg_lines_deleted", "avg_lines_per_commit",
        "active_days", "last_minute_commits",
        "total_merge_requests", "merged_requests",
        "review_comments_given", "review_comments_received",
        "total_issues_created", "total_issues_assigned", "issues_resolved", "issue_participation"
    ]

    for pid, students in data.items():
        if not students:
            print(f"⚠ Sem métricas para o projeto {pid}.")
            continue

        with open(filename, mode="w", newline='', encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(header)
            for student, metrics in students.items():
                row = [pid, metrics.get("group_id", ""), student, metrics.get("student_email", "")]
                row += [metrics.get(col, "") for col in header[4:]]
                writer.writerow(row)

        print(f"✅ Dados guardados em: {filename}")

if __name__ == "__main__":
    main()