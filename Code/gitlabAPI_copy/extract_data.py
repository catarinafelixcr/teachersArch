from gitlab import Gitlab

from collections import defaultdict
from statistics import mean
import datetime
import csv
import os
from datetime import datetime, timedelta, timezone

# Setup
GITLAB_URL = "https://gitlab.com"
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN", 'glpat-z7gzPpe48a5krLoLa4o4')
PROJECT_IDS = [
     61760884, 61760973, 61760822, 61708094, 61760919,61708152, 61708114, 61708087, 5052158450554251, 50554274, 50554307,
    50554328, 50554344, 50479247, 50554382
]
#61760884, 61760973, 61760822, 61708094, 61760919,61708152, 61708114, 61708087, 50521584

# Utils

def is_last_minute(commit_date_str, deadline):
    deadline_dt = datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc)
    commit_dt = datetime.fromisoformat(commit_date_str)
    if commit_dt.tzinfo is None:
        commit_dt = commit_dt.replace(tzinfo=timezone.utc)
    return (deadline_dt - commit_dt).days <= 2

def split_intervals(start, end, intervals=4):
    start_dt = datetime.fromisoformat(start)
    end_dt = datetime.fromisoformat(end)
    total_days = (end_dt - start_dt).days
    delta = total_days // intervals
    return [(start_dt + timedelta(days=i * delta), start_dt + timedelta(days=(i + 1) * delta)) for i in range(intervals)]

def get_project_time_bounds(commits, merge_requests):
    timestamps = [datetime.fromisoformat(c['created_at']) for c in commits]
    timestamps += [datetime.fromisoformat(m['created_at']) for m in merge_requests]
    if not timestamps:
        return None, None
    return min(timestamps).isoformat(), max(timestamps).isoformat()

def fetch_branching_activity(project):
    return len(project.branches.list(all=True))

def count_merges_to_main(mrs):
    return sum(1 for mr in mrs if mr["merged"] and mr.get("target_branch") in ["main", "master"])

def fetch_gitlab_commits(project, start, end, deadline):
    try:
        commits = project.commits.list(since=start.isoformat(), until=end.isoformat(), all=True, get_all=True)
    except Exception as e:
        print(f"⚠ Erro a obter commits: {e}")
        return []

    commits_data = []
    for commit in commits:
        try:
            stats = commit.stats or {}
            handle = commit.author_email.split('@')[0] if commit.author_email else ""
            commits_data.append({
                "project_id": project.id,
                "mention_handle": handle,
                "created_at": commit.created_at,
                "lines_added": stats.get('additions', 0),
                "lines_deleted": stats.get('deletions', 0),
                "lines_changed": stats.get('additions', 0) + stats.get('deletions', 0),
                "last_minute": is_last_minute(commit.created_at, deadline)
            })
        except Exception as e:
            print(f"⚠ Commit {commit.id} error: {e}")
    return commits_data

def count_comments_given_by_user(project, mr):
    comments = mr.notes.list(get_all=True)
    authors = defaultdict(int)
    for comment in comments:
        if comment.author and 'username' in comment.author:
            authors[comment.author['username']] += 1
    return dict(authors)

def fetch_gitlab_merge_requests(project, start, end):
    mrs = project.mergerequests.list(state='all', created_after=start.isoformat(), created_before=end.isoformat(), all=True, get_all=True)
    return [{
        "author_handle": mr.author['username'],
        "created_at": mr.created_at,
        "state": mr.state,
        "merged": mr.merged_at is not None,
        "target_branch": mr.target_branch,
        "review_comments_received": len(mr.notes.list(get_all=True)),
        "review_comments_given": count_comments_given_by_user(project, mr)
    } for mr in mrs]

def fetch_gitlab_issues(project, start, end):
    issues = project.issues.list(state='all', created_after=start.isoformat(), created_before=end.isoformat(), all=True, get_all=True)
    return [{
        "author_handle": issue.author['username'],
        "created_at": issue.created_at,
        "state": issue.state,
        "assignee": issue.assignee['username'] if issue.assignee else None,
        "resolved": issue.state == "closed",
        "comments": len(issue.notes.list(get_all=True)),
        "participants": list(set([n.author['username'] for n in issue.notes.list(get_all=True)]))
    } for issue in issues]

def aggregate_all_features(commits, mrs, issues, branches_created, merges_to_main, group_id, interval):
    features = defaultdict(lambda: {
        "project_id": "",
        "mention_handle": "",
        "group_id": group_id,
        "interval": interval,
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
        "branches_created": branches_created,
        "merges_to_main_branch": merges_to_main
    })

    commit_lines_added, commit_lines_deleted = defaultdict(list), defaultdict(list)
    commit_dates_by_user = defaultdict(set)

    for commit in commits:
        user = commit["mention_handle"]
        features[user]["mention_handle"] = user
        features[user]["total_commits"] += 1
        features[user]["last_minute_commits"] += int(commit["last_minute"])
        commit_lines_added[user].append(commit["lines_added"])
        commit_lines_deleted[user].append(commit["lines_deleted"])
        commit_dates_by_user[user].add(commit["created_at"][:10])

    for user in commit_lines_added:
        features[user]["avg_lines_per_commit"] = mean([a + b for a, b in zip(commit_lines_added[user], commit_lines_deleted[user])])
        features[user]["avg_lines_added"] = mean(commit_lines_added[user])
        features[user]["avg_lines_deleted"] = mean(commit_lines_deleted[user])
        features[user]["active_days"] = len(commit_dates_by_user[user])

    for mr in mrs:
        user = mr["author_handle"]
        features[user]["total_merge_requests"] += 1
        if mr["merged"]:
            features[user]["merged_requests"] += 1
        features[user]["review_comments_received"] += mr["review_comments_received"]
        for commenter, count in mr["review_comments_given"].items():
            features[commenter]["review_comments_given"] += count

    for issue in issues:
        creator = issue["author_handle"]
        features[creator]["total_issues_created"] += 1
        if issue["assignee"]:
            features[issue["assignee"]]["total_issues_assigned"] += 1
        if issue["resolved"]:
            features[creator]["issues_resolved"] += 1
        for participant in issue["participants"]:
            features[participant]["issue_participation"] += 1

    return features

def save_metrics_to_csv(data, filename):
    header = [
        "project_id", "group_id", "mention_handle", "interval",
        "total_commits", "avg_lines_added", "avg_lines_deleted", "avg_lines_per_commit",
        "active_days", "last_minute_commits", "total_merge_requests", "merged_requests",
        "review_comments_given", "review_comments_received", "total_issues_created",
        "total_issues_assigned", "issues_resolved", "issue_participation",
        "branches_created", "merges_to_main_branch"
    ]
    with open(filename, mode="w", newline='', encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(header)
        for pid, students in data.items():
            for student, metrics in students.items():
                row = [pid, metrics.get("group_id", ""), student, metrics.get("interval", "")]
                row += [metrics.get(col, 0) for col in header[4:]]
                writer.writerow(row)
    print(f"✅ Dados guardados em: {filename}")

def process_project(pid, gl):
    print(f"\n🔍 Processando projeto ID: {pid}")
    try:
        project = gl.projects.get(pid)
        namespace = project.namespace
        group_id = namespace['id'] if namespace['kind'] == 'group' else None

        all_commits = fetch_gitlab_commits(project, datetime(2022, 2, 1), datetime(2025, 1, 1), "2025-01-01T00:00:00")
        all_mrs = fetch_gitlab_merge_requests(project, datetime(2022, 2, 1), datetime(2025, 1, 1))
        start_str, end_str = get_project_time_bounds(all_commits, all_mrs)

        if not start_str or not end_str:
            print(f"⚠️  Projeto {pid} sem dados de tempo suficientes.")
            return

        start_dt = datetime.fromisoformat(start_str)
        end_dt = (start_dt + timedelta(days=100))
        intervals = split_intervals(start_dt.isoformat(), end_dt.isoformat(), intervals=5)

        branches_created = fetch_branching_activity(project)

        for i, (start, end) in enumerate(intervals):
            print(f"  → Intervalo {i+1}: {start.date()} a {end.date()}")
            commits = fetch_gitlab_commits(project, start, end, end.isoformat())
            mrs = fetch_gitlab_merge_requests(project, start, end)
            issues = fetch_gitlab_issues(project, start, end)
            merges_to_main = count_merges_to_main(mrs)
            metrics = aggregate_all_features(commits, mrs, issues, branches_created, merges_to_main, group_id, interval=i+1)
            save_metrics_to_csv({pid: metrics}, filename=f"project_{pid}_interval_{i+1}.csv")

    except Exception as e:
        print(f"❌ Erro ao processar projeto {pid}: {e}")

def main():
    gl = Gitlab(GITLAB_URL, private_token=GITLAB_TOKEN)
    for pid in PROJECT_IDS:
        process_project(pid, gl)
    print("✅ Processamento concluído.")

if __name__ == "__main__":
    main()
