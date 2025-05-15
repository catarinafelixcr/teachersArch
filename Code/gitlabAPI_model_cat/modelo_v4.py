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

        # ------------------------------------------
        # Estratégia Atualizada: Escala Dinâmica
        # ------------------------------------------
        # Calcular média e desvio padrão das previsões
        mean_pred = np.mean(y_pred)
        std_pred = np.std(y_pred)

        # Definir limites dinâmicos com base na distribuição
        limite_inferior = mean_pred - 2 * std_pred  # 2σ abaixo da média
        limite_superior = mean_pred + 2 * std_pred  # 2σ acima da média

        # Escalonar notas com possibilidade de extrapolar 10-20
        y_esc = np.interp(
            y_pred,
            (limite_inferior, limite_superior),
            (8, 22)  # Intervalo mais amplo para permitir extrapolação
        )

        # Aplicar limites apenas para evitar valores absurdos
        y_esc = np.clip(y_esc, 0, 20)  # Notas entre 5 e 25 (ajuste conforme necessidade)

        print(f"\nIntervalo {intervalo}:")
        for i, row in df_raw.iterrows():
            print(f"  {row['username']:20s} --> {y_esc[i]:.2f}")

    except FileNotFoundError:
        print(f"Não encontrei o modelo para o intervalo {intervalo}!!!!!")



#############################
# 
#
#Previsões com todos os modelos (intervalos 1 a 5):
#
#Intervalo 1:
#  catafcruz02          --> 19.05
#  pedromazevedo21      --> 11.32
#  miguelant            --> 19.05
#  LucianaRocha         --> 14.41
#  furdurico            --> 11.18
#
#Intervalo 2:
#  catafcruz02          --> 19.14
#  pedromazevedo21      --> 12.22
#  miguelant            --> 19.43
#  LucianaRocha         --> 11.99
#  furdurico            --> 12.22
#
#Intervalo 3:
#  catafcruz02          --> 17.67
#  pedromazevedo21      --> 17.16
#  miguelant            --> 17.38
#  LucianaRocha         --> 8.41
#  furdurico            --> 14.38
#
#Intervalo 4:
#  catafcruz02          --> 18.43
#  pedromazevedo21      --> 13.91
#  miguelant            --> 18.10
#  LucianaRocha         --> 15.74
#  furdurico            --> 8.82
#
#Intervalo 5:
#  catafcruz02          --> 18.91
#  pedromazevedo21      --> 12.47
#  miguelant            --> 19.04
#  LucianaRocha         --> 14.37
#  furdurico            --> 10.22
