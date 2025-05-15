import pandas as pd
import joblib
from gitlab import Gitlab
import os
import datetime
import numpy as np
from sklearn.preprocessing import MinMaxScaler


FEATURES = [
    "review_comments_given",
    "review_comments_received",
    "total_review_activity_log",
    "merged_requests",
    "total_merge_requests",
    "merges_to_main_branch",
    "total_issues_created",
    "issues_resolved",
    "issue_resolution_rate_log",
    "sum_lines_added_log",
    "issue_participation_log",
    "branches_created"
]
EPSILON = 1e-6


def preprocess_interval(df):
    df = df.copy()
    df["total_review_activity_log"] = np.log1p(
        df.get("review_comments_given", 0) + df.get("review_comments_received", 0)
    )
    df["issue_resolution_rate_log"] = np.log1p(
        df.get("issues_resolved", 0) / (df.get("total_issues_created", 0) + EPSILON)
    )
    df["sum_lines_added_log"] = np.log1p(df.get("sum_lines_added", 0))
    df["issue_participation_log"] = np.log1p(df.get("issue_participation", 0))

    for col in FEATURES:
        if col not in df:
            df[col] = 0

    return df[FEATURES]

# --------------------------
# Obter dados do GitLab
# --------------------------
def obter_dados_gitlab(project_path, gitlab_url, gitlab_token, interval):
    gl = Gitlab(gitlab_url, private_token=gitlab_token)
    try:
        project = gl.projects.get(project_path)
        members = project.members.list(all=True)
        all_mrs = project.mergerequests.list(state='all', all=True)

        def coletar_dados(member):
            user = gl.users.get(member.id)
            end_date = datetime.datetime.now()
            start_date = end_date - datetime.timedelta(days=interval)

            commits = project.commits.list(author=user.username, since=start_date, until=end_date, all=True)
            total_commits = len(commits)

            total_lines_added = 0
            total_lines_deleted = 0
            for commit in commits:
                try:
                    if commit.parent_ids:
                        changes = project.repository_compare(from_=commit.parent_ids[0], to=commit.id)
                        if 'diffs' in changes:
                            for diff in changes['diffs']:
                                total_lines_added += diff.get('new_lines', 0)
                                total_lines_deleted += diff.get('old_lines', 0)
                except Exception:
                    continue

            branches = project.branches.list(search=user.username, all=True)
            merged_requests = project.mergerequests.list(author_id=member.id, state='merged', all=True)
            total_merge_requests = project.mergerequests.list(author_id=member.id, all=True)
            issues_created = project.issues.list(author_id=member.id, all=True)
            issues_closed = project.issues.list(author_id=member.id, state='closed', all=True)

            comments_given = 0
            comments_received = 0
            for mr in all_mrs:
                try:
                    notes = mr.notes.list(all=True)
                    for note in notes:
                        if note.author["username"] == user.username:
                            comments_given += 1
                        elif mr.author["username"] == user.username:
                            comments_received += 1
                except Exception:
                    continue

            return {
                "username": user.username,
                "total_commits": total_commits,
                "sum_lines_added": total_lines_added,
                "sum_lines_deleted": total_lines_deleted,
                "branches_created": len(branches),
                "merged_requests": len(merged_requests),
                "total_merge_requests": len(total_merge_requests),
                "merges_to_main_branch": 0,
                "total_issues_created": len(issues_created),
                "issues_resolved": len(issues_closed),
                "issue_participation": 0,
                "review_comments_given": comments_given,
                "review_comments_received": comments_received,
                "interval": interval
            }

        return pd.DataFrame([coletar_dados(m) for m in members])

    except Exception as e:
        print(f"Erro ao obter dados: {e}")
        return pd.DataFrame()


if __name__ == "__main__":
    gitlab_url = "https://gitlab.com"
    gitlab_token = os.getenv("GITLAB_TOKEN", "glpat-z7gzPpe48a5krLoLa4o4")
    project_path = "dei-uc/pecd2025/pecd2025-pl2g4"

    intervalo_git = int(input("Intervalo a analisar: "))

    print(f"A obter dados do GitLab (intervalo {intervalo_git})...")
    df_raw = obter_dados_gitlab(project_path, gitlab_url, gitlab_token, intervalo_git)

    if df_raw.empty:
        print(" Nenhum dado obtido :(")
    else:
        print("Dados recolhidos para todos os membros.\n")

        df_ready = preprocess_interval(df_raw)

        print("\nPrevisões com todos os modelos (intervalos 1 a 5):")
        for intervalo in range(1, 6):
            modelo_nome = f"modelo_intervalo{intervalo}.pkl"
            try:
                modelo = joblib.load(modelo_nome)
                y_pred = modelo.predict(df_ready)

                scaler = MinMaxScaler(feature_range=(8, 19))  
                y_esc = scaler.fit_transform(y_pred.reshape(-1, 1)).ravel()
                y_final = np.clip(y_esc, 0, 20)

                print(f"\nIntervalo {intervalo}:")
                for i, row in df_raw.iterrows():
                    print(f"  {row['username']:20s} --> {y_final[i]:.2f}")


            except FileNotFoundError:
                print(f"Não encontrei o modelo para o intervalo {intervalo}!!!!! algo de errado não está certo")


# 
#Previsões com todos os modelos (intervalos 1 a 5):
#
#Intervalo 1:
#  catafcruz02          --> 19.00
#  pedromazevedo21      --> 8.19
#  miguelant            --> 19.00
#  LucianaRocha         --> 12.52
#  furdurico            --> 8.00
#
#Intervalo 2:
#  catafcruz02          --> 18.58
#  pedromazevedo21      --> 8.34
#  miguelant            --> 19.00
#  LucianaRocha         --> 8.00
#  furdurico            --> 8.34
#
#Intervalo 3:
#  catafcruz02          --> 19.00
#  pedromazevedo21      --> 18.39
#  miguelant            --> 18.65
#  LucianaRocha         --> 8.00
#  furdurico            --> 15.10
#
#Intervalo 4:
#  catafcruz02          --> 19.00
#  pedromazevedo21      --> 13.82
#  miguelant            --> 18.62
#  LucianaRocha         --> 15.93
#  furdurico            --> 8.00
#
#Intervalo 5:
#  catafcruz02          --> 18.84
#  pedromazevedo21      --> 10.82
#  miguelant            --> 19.00
#  LucianaRocha         --> 13.18
#  furdurico            --> 8.00