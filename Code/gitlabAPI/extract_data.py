from gitlab import Gitlab
from collections import defaultdict
from statistics import mean
import datetime
import csv


gitlab_url = "https://gitlab.com"
gitlab_token = 'glpat-z7gzPpe48a5krLoLa4o4'  
'''project_ids = [
    61760884, 61760973, 61760822, 61708094, 61760919, 61708152, 61708114, 61708087,
    50521584, 50554251, 50554274, 50554307, 50554328, 50554344, 50479247, 50554382
]'''

project_ids = [
    50521584, 50554251, 50554274, 50554307,
    50554328, 50554344, 50479247, 50554382
]

start_date = datetime.datetime(2022, 2, 1).isoformat()
end_date = datetime.datetime(2025, 1, 1).isoformat()

def main():
    gl = Gitlab(gitlab_url, private_token=gitlab_token)

    all_commits, all_mrs, all_issues = [], [], []

    for pid in project_ids:
        print(f"\nProcessando projeto ID: {pid}")
        try:
            project = gl.projects.get(pid)

            print("Commits...")
            commits = fetch_gitlab_commits(project)
            all_commits.extend(commits)

            print("Merge Requests...")
            mrs = fetch_gitlab_merge_requests(project)
            all_mrs.extend(mrs)

            print("Issues...")
            issues = fetch_gitlab_issues(project)
            all_issues.extend(issues)

        except Exception as e:
            print(f"Erro ao processar projeto {pid}: {e}")

    print("\nAgregando métricas por estudante...")
    student_features = aggregate_all_features(all_commits, all_mrs, all_issues)

    for student, metrics in student_features.items():
        print(f"\nEstudante: {student}")
        for k, v in metrics.items():
            print(f"  {k}: {v}")

    save_metrics_to_csv(student_features)

def fetch_gitlab_commits(project):
    commits = project.commits.list(since=start_date, until=end_date, all=True, get_all=True)
    print(f"  → {len(commits)} commits encontrados")

    commits_data = []

    for commit in commits:
        detailed_commit = project.commits.get(commit.id)
        stats = detailed_commit.stats

        commits_data.append({
            "author_name": detailed_commit.author_name,
            "created_at": detailed_commit.created_at,
            "lines_added": stats['additions'],
            "lines_deleted": stats['deletions'],
            "lines_changed": stats['additions'] + stats['deletions']
        })

    return commits_data

def fetch_gitlab_merge_requests(project):
    mrs = project.mergerequests.list(state='all', created_after=start_date, created_before=end_date, all=True, get_all=True)
    print(f"  → {len(mrs)} merge requests encontrados")

    return [{
        "author_name": mr.author['name'],
        "created_at": mr.created_at,
        "state": mr.state,
        "merged": mr.merged_at is not None
    } for mr in mrs]

def fetch_gitlab_issues(project):
    issues = project.issues.list(state='all', created_after=start_date, created_before=end_date, all=True, get_all=True)
    print(f"  → {len(issues)} issues encontrados")

    return [{
        "author_name": issue.author['name'],
        "created_at": issue.created_at,
        "state": issue.state,
        "assignee": issue.assignee['name'] if issue.assignee else None
    } for issue in issues]

def aggregate_all_features(commits, merge_requests, issues):
    features = defaultdict(lambda: {
        "total_commits": 0,
        "avg_lines_per_commit": 0,
        "active_days": 0,
        "total_merge_requests": 0,
        "merged_requests": 0,
        "total_issues_created": 0,
        "total_issues_assigned": 0
    })

    commit_dates_by_user = defaultdict(set)
    lines_changed_by_user = defaultdict(list)

    for commit in commits:
        user = commit["author_name"]
        features[user]["total_commits"] += 1
        lines_changed_by_user[user].append(commit["lines_changed"])
        commit_date = commit["created_at"][:10]
        commit_dates_by_user[user].add(commit_date)

    for user in lines_changed_by_user:
        features[user]["avg_lines_per_commit"] = mean(lines_changed_by_user[user])
        features[user]["active_days"] = len(commit_dates_by_user[user])

    for mr in merge_requests:
        user = mr["author_name"]
        features[user]["total_merge_requests"] += 1
        if mr["merged"]:
            features[user]["merged_requests"] += 1

    for issue in issues:
        creator = issue["author_name"]
        features[creator]["total_issues_created"] += 1
        if issue["assignee"]:
            assignee = issue["assignee"]
            features[assignee]["total_issues_assigned"] += 1

    return features



def save_metrics_to_csv(data, filename="student_metrics.csv"):
    # Extrai os nomes de todas as métricas da primeira entrada
    if not data:
        print("⚠️ Nenhum dado para guardar.")
        return

    header = ["student"] + list(next(iter(data.values())).keys())

    with open(filename, mode="w", newline='', encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(header)

        for student, metrics in data.items():
            row = [student] + [metrics.get(k, "") for k in header[1:]]
            writer.writerow(row)

    print(f"Dados guardados em: {filename}")


if __name__ == "__main__":
    main()
