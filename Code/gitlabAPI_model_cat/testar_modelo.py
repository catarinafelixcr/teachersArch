import pandas as pd
import joblib
from gitlab import Gitlab
import os
import datetime
import numpy as np

# Configuração
FEATURES_FINAIS_PARA_MODELO = [
    'total_issues_created_log',
    'issue_participation_log',
    'issue_resolution_rate_created_log',
    'total_review_activity_log',
    'merged_ratio_log',
    'sum_lines_added_log',
    'interval',
    'branches_created',
]
EPSILON = 1e-6

# ------------------------------------------------------------------------
# Função de pré-processamento (igual ao do treino)
# ------------------------------------------------------------------------
def preprocess_data_for_prediction(df):
    df_processed = df.copy()

    df_processed['sum_lines_added_log'] = np.log1p(df_processed.get('sum_lines_added', 0))
    df_processed['total_issues_created_log'] = np.log1p(df_processed.get('total_issues_created', 0))
    df_processed['issue_participation_log'] = np.log1p(df_processed.get('issue_participation', 0))

    merged_ratio = df_processed.get('merged_requests', 0) / (df_processed.get('total_merge_requests', 0) + EPSILON)
    df_processed['merged_ratio_log'] = np.log1p(merged_ratio)

    issue_res_rate = df_processed.get('issues_resolved', 0) / (df_processed.get('total_issues_created', 0) + EPSILON)
    df_processed['issue_resolution_rate_created_log'] = np.log1p(issue_res_rate)

    total_review = df_processed.get('review_comments_given', 0) + df_processed.get('review_comments_received', 0)
    df_processed['total_review_activity_log'] = np.log1p(total_review)

    # Garantir que todas as colunas existem
    for col in FEATURES_FINAIS_PARA_MODELO:
        if col not in df_processed:
            df_processed[col] = 0

    return df_processed[FEATURES_FINAIS_PARA_MODELO]

# ------------------------------------------------------------------------
# Função para obter dados do GitLab
# ------------------------------------------------------------------------
def obter_dados_gitlab(project_path, gitlab_url, gitlab_token, interval):
    gl = Gitlab(gitlab_url, private_token=gitlab_token)
    try:
        project = gl.projects.get(project_path)
        members = project.members.list(all=True)

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

            return {
                "username": user.username,
                "total_commits": total_commits,
                "sum_lines_added": total_lines_added,
                "sum_lines_deleted": total_lines_deleted,
                "branches_created": len(branches),
                "merged_requests": len(merged_requests),
                "total_merge_requests": len(total_merge_requests),
                "total_issues_created": len(issues_created),
                "issues_resolved": len(issues_closed),
                "issue_participation": 0,
                "review_comments_given": 0,
                "review_comments_received": 0,
                "interval": interval
            }

        return pd.DataFrame([coletar_dados(m) for m in members])

    except Exception as e:
        print(f"Erro ao obter dados: {e}")
        return pd.DataFrame()

# ------------------------------------------------------------------------
# Execução principal
# ------------------------------------------------------------------------

if __name__ == "__main__":
    gitlab_url = "https://gitlab.com"
    gitlab_token = os.getenv("GITLAB_TOKEN", "glpat-z7gzPpe48a5krLoLa4o4")  # substitui por token real
    project_path = "dei-uc/pecd2025/pecd2025-pl2g4"

    intervalo = int(input("⏱ Intervalo a analisar: "))

    print("🔄 A obter dados do GitLab...")
    df_raw = obter_dados_gitlab(project_path, gitlab_url, gitlab_token, intervalo)

    if df_raw.empty:
        print("⚠️ Nenhum dado obtido.")
    else:
        print("Dados recolhidos para os membros.\n")

        df_ready = preprocess_data_for_prediction(df_raw)
        modelo = joblib.load("modelo_final_nota_aluno.pkl")
        previsoes = modelo.predict(df_ready)

        print("\n🎯 Previsões de nota final:")
        for i, row in df_raw.iterrows():
            print(f"  {row['username']:20s} → {previsoes[i]:.2f}")
