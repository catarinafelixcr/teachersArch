import os
import csv
from datetime import datetime, timedelta
from gitlab import Gitlab

from utils.gitlab_features import (
    fetch_gitlab_merge_requests,
    fetch_gitlab_issues,
    fetch_branching_activity,
    count_merges_to_main
)
from utils.feature_aggregation import aggregate_all_features
from utils.helpers import split_intervals, get_project_time_bounds, is_last_minute
from config import GITLAB_URL, GITLAB_TOKEN, PROJECT_IDS


def fetch_gitlab_commits(project, start, end, deadline):
    try:
        commits = project.commits.list(
            since=start.isoformat(), 
            until=end.isoformat(), 
            all=True, 
            get_all=True
        )
    except Exception as e:
        print(f"⚠ Erro a obter commits para o projeto {project.id}: {e}")
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
            print(f"⚠ Erro ao processar commit {getattr(commit, 'id', '?')} no projeto {project.id}: {e}")
    return commits_data


def save_metrics_to_csv(metrics_dict, filename):
    os.makedirs("output", exist_ok=True)
    path = os.path.join("output", filename)

    try:
        with open(path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            headers = ["project_id"] + list(next(iter(metrics_dict.values())).keys())
            writer.writerow(headers)
            for pid, metrics in metrics_dict.items():
                row = [pid] + [metrics.get(k, "") for k in headers[1:]]
                writer.writerow(row)
        print(f"✅ Métricas guardadas em {path}")
    except Exception as e:
        print(f"❌ Erro ao guardar ficheiro {filename}: {e}")


def process_interval(project, group_id, branches_created, pid, interval_idx, start, end):
    print(f"  → Intervalo {interval_idx}: {start.date()} a {end.date()}")

    commits = fetch_gitlab_commits(project, start, end, end.isoformat())
    mrs = fetch_gitlab_merge_requests(project, start, end)
    issues = fetch_gitlab_issues(project, start, end)
    merges_to_main = count_merges_to_main(mrs)

    metrics = aggregate_all_features(
        commits, mrs, issues, 
        branches_created, merges_to_main, 
        group_id, interval=interval_idx
    )
    save_metrics_to_csv({pid: metrics}, filename=f"project_{pid}_interval_{interval_idx}.csv")


def process_project(pid, gl):
    print(f"\n🔍 Processando projeto ID: {pid}")
    try:
        project = gl.projects.get(pid)
        namespace = project.namespace
        group_id = namespace['id'] if namespace['kind'] == 'group' else None
    except Exception as e:
        print(f"❌ Erro a obter projeto {pid}: {e}")
        return

    try:
        all_commits = fetch_gitlab_commits(project, datetime(2022, 2, 1), datetime(2025, 1, 1), "2025-01-01T00:00:00")
        all_mrs = fetch_gitlab_merge_requests(project, datetime(2022, 2, 1), datetime(2025, 1, 1))
        start_str, end_str = get_project_time_bounds(all_commits, all_mrs)

        if not start_str or not end_str:
            print(f"⚠️ Projeto {pid} sem dados de tempo suficientes.")
            return

        start_dt = datetime.fromisoformat(start_str)
        end_dt = start_dt + timedelta(days=100)  # ajustável

        intervals = split_intervals(start_dt.isoformat(), end_dt.isoformat(), intervals=5)
        branches_created = fetch_branching_activity(project)

        for i, (start, end) in enumerate(intervals, start=1):
            process_interval(project, group_id, branches_created, pid, i, start, end)

    except Exception as e:
        print(f"❌ Erro ao processar métricas do projeto {pid}: {e}")


def main():
    gl = Gitlab(GITLAB_URL, private_token=GITLAB_TOKEN)
    for pid in PROJECT_IDS:
        process_project(pid, gl)


if __name__ == "__main__":
    main()
