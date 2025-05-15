from gitlab import Gitlab
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone
import os, csv

# Setup
GITLAB_URL = "https://gitlab.com"
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN", 'glpat-z7gzPpe48a5krLoLa4o4')
PROJECT_IDS = [  50554274,
    50554307,
    50554328,
    50554344,
    50479247,
    50554382]

def is_last_minute(commit_date_str, deadline):
    deadline_dt = datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc)
    commit_dt = datetime.fromisoformat(commit_date_str)
    if commit_dt.tzinfo is None:
        commit_dt = commit_dt.replace(tzinfo=timezone.utc)
    return (deadline_dt - commit_dt).days <= 2

def get_first_commit_date(commits):
    timestamps = [datetime.fromisoformat(c['created_at']).replace(tzinfo=timezone.utc) for c in commits]
    return min(timestamps) if timestamps else None

def fetch_detailed_commit(project, commit):
    try:
        detailed = project.commits.get(commit.id)
        stats = detailed.stats
        handle = detailed.author_email.split('@')[0] if detailed.author_email else ""
        created_at = datetime.fromisoformat(detailed.created_at)
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        else:
            created_at = created_at.astimezone(timezone.utc)
        return {
            "project_id": project.id,
            "mention_handle": handle,
            "created_at": created_at.isoformat(),
            "lines_added": stats['additions'],
            "lines_deleted": stats['deletions'],
            "lines_changed": stats['additions'] + stats['deletions'],
            "last_minute": is_last_minute(created_at.isoformat(), datetime(2025, 1, 1).isoformat())
        }
    except Exception as e:
        print(f"⚠ Commit {commit.id} error: {e}")
        return None

def fetch_all_commits(project, start, end, max_workers=10):
    commits_raw = project.commits.list(since=start.isoformat(), until=end.isoformat(), all=True, get_all=True)
    commits_data = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(fetch_detailed_commit, project, commit) for commit in commits_raw]
        for future in as_completed(futures):
            result = future.result()
            if result:
                commits_data.append(result)
    return sorted(commits_data, key=lambda x: x["created_at"])

def fetch_all_merge_requests(project, start, end):
    mrs = project.mergerequests.list(state='all', created_after=start.isoformat(), created_before=end.isoformat(), all=True, get_all=True)
    result = []
    for mr in mrs:
        comments = mr.notes.list(get_all=True)
        given = defaultdict(int)
        for comment in comments:
            if comment.author and 'username' in comment.author:
                given[comment.author['username']] += 1
        result.append({
            "author_handle": mr.author['username'],
            "created_at": mr.created_at,
            "state": mr.state,
            "merged": mr.merged_at is not None,
            "target_branch": mr.target_branch,
            "review_comments_received": len(comments),
            "review_comments_given": dict(given)
        })
    return sorted(result, key=lambda x: x["created_at"])

def fetch_all_issues(project, start, end):
    issues = project.issues.list(state='all', created_after=start.isoformat(), created_before=end.isoformat(), all=True, get_all=True)
    results = []
    for issue in issues:
        notes = issue.notes.list(get_all=True)
        participants = list(set(n.author['username'] for n in notes if n.author))
        results.append({
            "author_handle": issue.author['username'],
            "created_at": issue.created_at,
            "state": issue.state,
            "assignee": issue.assignee['username'] if issue.assignee else None,
            "resolved": issue.state == "closed",
            "comments": len(notes),
            "participants": participants
        })
    return sorted(results, key=lambda x: x["created_at"])

def count_merges_to_main(mrs):
    return sum(1 for mr in mrs if mr["merged"] and mr.get("target_branch") in ["main", "master"])

def save_metrics_quantitative_only(data, filename):
    header = [
        "project_id", "group_id", "mention_handle", "interval",
        "total_commits", "sum_lines_added", "sum_lines_deleted", "sum_lines_per_commit",
        "active_days", "last_minute_commits", "total_merge_requests", "merged_requests",
        "review_comments_given", "review_comments_received", "total_issues_created",
        "total_issues_assigned", "issues_resolved", "issue_participation",
        "branches_created", "merges_to_main_branch"
    ]
    with open(filename, mode="w", newline='', encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        for pid, users in data.items():
            for user, row in users.items():
                values = [
                    pid, row["group_id"], user, row["interval"],
                    row.get("total_commits", 0),
                    row.get("sum_lines_added", 0),
                    row.get("sum_lines_deleted", 0),
                    row.get("sum_lines_per_commit", 0),
                    row.get("active_days", 0),
                    row.get("last_minute_commits", 0),
                    row.get("total_merge_requests", 0),
                    row.get("merged_requests", 0),
                    row.get("review_comments_given", 0),
                    row.get("review_comments_received", 0),
                    row.get("total_issues_created", 0),
                    row.get("total_issues_assigned", 0),
                    row.get("issues_resolved", 0),
                    row.get("issue_participation", 0),
                    row.get("branches_created", 0),
                    row.get("merges_to_main_branch", 0)
                ]
                writer.writerow(values)
    print(f"✅ Guardado em: {filename}")

def main():
    gl = Gitlab(GITLAB_URL, private_token=GITLAB_TOKEN)

    for pid in PROJECT_IDS:
        print(f"\n📦 Projeto ID: {pid}")
        try:
            project = gl.projects.get(pid)
            namespace = project.namespace
            group_id = namespace['id'] if namespace['kind'] == 'group' else None

            # Start time conditionally for project IDs starting with 5
            if str(pid).startswith("5"):
                first_commit_time = datetime(2023, 9, 14, tzinfo=timezone.utc)
            else:
                first_commit_time = datetime(2022, 1, 1, tzinfo=timezone.utc)

            end_time = first_commit_time + timedelta(days=100)
            all_commits = fetch_all_commits(project, first_commit_time, end_time)
            all_mrs = fetch_all_merge_requests(project, first_commit_time, end_time)
            all_issues = fetch_all_issues(project, first_commit_time, end_time)

            if not all_commits:
                print(f"⚠️  Projeto {pid} sem commits válidos.")
                continue

            branches_created = len(project.branches.list(all=True))
            intervals = [(first_commit_time, first_commit_time + timedelta(days=20 * (i + 1))) for i in range(5)]

            for i, (_, end_i) in enumerate(intervals):
                interval_commits = [
                    c for c in all_commits
                    if datetime.fromisoformat(c["created_at"]).replace(tzinfo=timezone.utc) < end_i.replace(tzinfo=timezone.utc)
                ]
                interval_mrs = [
                    m for m in all_mrs
                    if datetime.fromisoformat(m["created_at"]).replace(tzinfo=timezone.utc) < end_i.replace(tzinfo=timezone.utc)
                ]
                interval_issues = [
                    iss for iss in all_issues
                    if datetime.fromisoformat(iss["created_at"]).replace(tzinfo=timezone.utc) < end_i.replace(tzinfo=timezone.utc)
                ]
                merges_to_main = count_merges_to_main(interval_mrs)

                features = defaultdict(lambda: {
                    "project_id": pid,
                    "group_id": group_id,
                    "mention_handle": "",
                    "interval": i+1,
                    "total_commits": 0,
                    "sum_lines_added": 0,
                    "sum_lines_deleted": 0,
                    "sum_lines_per_commit": 0,
                    "commit_count": 0,
                    "active_days": set(),
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

                for c in interval_commits:
                    u = c["mention_handle"]
                    f = features[u]
                    f["mention_handle"] = u
                    f["total_commits"] += 1
                    f["last_minute_commits"] += int(c["last_minute"])
                    f["sum_lines_added"] += c["lines_added"]
                    f["sum_lines_deleted"] += c["lines_deleted"]
                    f["sum_lines_per_commit"] += c["lines_changed"]
                    f["commit_count"] += 1
                    f["active_days"].add(c["created_at"][:10])

                for m in interval_mrs:
                    u = m["author_handle"]
                    f = features[u]
                    f["total_merge_requests"] += 1
                    if m["merged"]:
                        f["merged_requests"] += 1
                    f["review_comments_received"] += m["review_comments_received"]
                    for commenter, count in m["review_comments_given"].items():
                        features[commenter]["review_comments_given"] += count

                for iss in interval_issues:
                    u = iss["author_handle"]
                    f = features[u]
                    f["total_issues_created"] += 1
                    if iss["assignee"]:
                        features[iss["assignee"]]["total_issues_assigned"] += 1
                    if iss["resolved"]:
                        f["issues_resolved"] += 1
                    for p in iss["participants"]:
                        features[p]["issue_participation"] += 1

                for f in features.values():
                    f["active_days"] = len(f["active_days"])

                save_metrics_quantitative_only({pid: features}, f"project_{pid}_interval_{i+1}_FIXED.csv")

        except Exception as e:
            print(f"❌ Erro no projeto {pid}: {e}")

if __name__ == "__main__":
    main()
