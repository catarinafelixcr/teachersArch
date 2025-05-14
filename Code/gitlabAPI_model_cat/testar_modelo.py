import pandas as pd
import joblib
from gitlab import Gitlab
import os
import datetime
import numpy as np

# Constantes
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
COLS_TO_DROP_INITIAL = []
EPSILON = 1e-6

# ------------------------------------------------------------------------------
# Função de Pré-Processamento
# ------------------------------------------------------------------------------
def preprocess_data_for_prediction(df):
    df_processed = df.copy()

    # Criar features log
    df_processed['sum_lines_added_log'] = np.log1p(df_processed.get('sum_lines_added', 0))
    df_processed['total_issues_created_log'] = np.log1p(df_processed.get('total_issues_created', 0))
    df_processed['issue_participation_log'] = np.log1p(df_processed.get('issue_participation', 0))

    merged_ratio = df_processed.get('merged_requests', 0) / (df_processed.get('total_merge_requests', 0) + EPSILON)
    df_processed['merged_ratio_log'] = np.log1p(merged_ratio)

    issue_res_rate = df_processed.get('issues_resolved', 0) / (df_processed.get('total_issues_created', 0) + EPSILON)
    df_processed['issue_resolution_rate_created_log'] = np.log1p(issue_res_rate)

    total_review = df_processed.get('review_comments_given', 0) + df_processed.get('review_comments_received', 0)
    df_processed['total_review_activity_log'] = np.log1p(total_review)

    # Garantir que todas as features estão presentes
    for col in FEATURES_FINAIS_PARA_MODELO:
        if col not in df_processed:
            df_processed[col] = 0

    return df_processed[FEATURES_FINAIS_PARA_MODELO]

# ------------------------------------------------------------------------------
# Função para obter dados do GitLab
# ------------------------------------------------------------------------------
def obter_dados_gitlab(project_path, gitlab_url, gitlab_token, interval):
    gl = Gitlab(gitlab_url, private_token=gitlab_token)

    try:
        project = gl.projects.get(project_path)
        members = project.members.list(all=True)

        def coletar_dados_membro(member):
            user = gl.users.get(member.id)

            end_date = datetime.datetime.now()
            start_date = end_date - datetime.timedelta(days=interval)

            commits = project.commits.list(author=user.username, since=start_date, until=end_date, all=True, get_all=True)
            total_commits = len(commits)

            total_lines_added = 0
            total_lines_removed = 0
            for commit in commits:
                try:
                    if commit.parent_ids:
                        changes = project.repository_compare(from_=commit.parent_ids[0], to=commit.id)
                        if 'diffs' in changes:
                            for diff in changes['diffs']:
                                total_lines_added += diff.get('new_lines', 0)
                                total_lines_removed += diff.get('old_lines', 0)
                except Exception:
                    continue

            branches = project.branches.list(search=user.username, all=True, get_all=True)
            branches_created = len(branches)

            merged_requests = project.mergerequests.list(author_id=member.id, state='merged', all=True, get_all=True)
            total_merge_requests = project.mergerequests.list(author_id=member.id, all=True, get_all=True)

            issues_created = project.issues.list(author_id=member.id, all=True, get_all=True)
            issues_resolved = project.issues.list(author_id=member.id, state='closed', all=True, get_all=True)

            return {
                "username": user.username,
                "total_commits": total_commits,
                "sum_lines_added": total_lines_added,
                "sum_lines_deleted": total_lines_removed,
                "branches_created": branches_created,
                "merged_requests": len(merged_requests),
                "total_merge_requests": len(total_merge_requests),
                "total_issues_created": len(issues_created),
                "issues_resolved": len(issues_resolved),
                "issue_participation": 0,
                "review_comments_given": 0,
                "review_comments_received": 0,
                "interval": interval,
            }

        data = [coletar_dados_membro(m) for m in members] if members else []
        return pd.DataFrame(data)

    except Exception as e:
        print("Erro ao obter dados do GitLab:", e)
        return None

# ------------------------------------------------------------------------------
# Execução
# ------------------------------------------------------------------------------
pipeline = joblib.load('melhor_modelo.pkl')

gitlab_url = "https://gitlab.com"
gitlab_token = os.getenv("GITLAB_TOKEN", "glpat-z7gzPpe48a5krLoLa4o4")
project_path = "dei-uc/pecd2025/pecd2025-pl2g4"

try:
    gl = Gitlab(gitlab_url, private_token=gitlab_token)
    project = gl.projects.get(project_path)
    print(f"Projeto encontrado: {project.name}")
except Exception as e:
    print(f"Erro ao conectar ao GitLab ou encontrar o projeto: {e}")
    exit()

intervalo = int(input("Por favor, insira o valor do intervalo: "))

df_grupo = obter_dados_gitlab(project_path, gitlab_url, gitlab_token, intervalo)

if df_grupo is not None:
    print("\nDados do Grupo:")
    print(df_grupo)

    df_grupo_preparado = preprocess_data_for_prediction(df_grupo.copy())
    print("\nDados Preparados:")
    print(df_grupo_preparado)

    previsoes = pipeline.predict(df_grupo_preparado)

    print("\nPrevisões:")
    for i, previsao in enumerate(previsoes):
        print(f"user: {df_grupo['username'][i]}, Previsão: {previsao}")
else:
    print("Não foi possível obter os dados do grupo.")
