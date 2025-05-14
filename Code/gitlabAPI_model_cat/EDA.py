# %% [markdown]
# # EDA
# - **abordagem:** vou usar todos intervalos num só para verificar o desempenho... secalhar é melhor do que achamos
# 
# Neste ficheiro não vou prever o modelo, vou só mesmo fazer a análise exploratória

# %% [markdown]
# ## Preparação dos Dados

# %% [markdown]
# 1.Juntar os ficheiros

# %%
import pandas as pd
import glob

all_files = sorted(glob.glob("student_features_interval_*.csv"))
df_all = pd.concat((pd.read_csv(f) for f in all_files), ignore_index=True)

# %% [markdown]
# 2. Remover colunas irrelevantes para treino (não são features numéricas úteis)
# 

# %%
cols_to_drop = ["project_id", "group_id", "mention_handle"]
df_all_clean = df_all.drop(columns=[col for col in cols_to_drop if col in df_all.columns])

# %% [markdown]
# 3. Manter apenas linhas com nota final

# %%
df_all_clean = df_all_clean.dropna(subset=["Final Grade"])

# %% [markdown]
#  4. Separar features e target
# 

# %%
X = df_all_clean.drop(columns=["Final Grade"])
y = df_all_clean["Final Grade"]

# %%
X.head()

# %%
y.head()

# %% [markdown]
# ## EDA

# %%
# adeus duplas
df_all_clean[df_all_clean.duplicated()]

# %%
df_all_clean.columns
# output: Index(['interval', 'total_commits', 'sum_lines_added', 'sum_lines_deleted',
#       'sum_lines_per_commit', 'active_days', 'last_minute_commits',
#       'total_merge_requests', 'merged_requests', 'review_comments_given',
#       'review_comments_received', 'total_issues_created',
#       'total_issues_assigned', 'issues_resolved', 'issue_participation',
#       'branches_created', 'merges_to_main_branch', 'Final Grade'],
#      dtype='object')

# %%
target = 'Final Grade'

# %%
features = []
for col in df_all_clean.columns:
    if col != target and col != "interval":
        features.append(col)

# %%
import numpy as np
numerical_features = df_all_clean[features].select_dtypes(include=np.number).columns.tolist()

# %%
categorical_features = df_all_clean[features].select_dtypes(exclude=np.number).columns.tolist()

# %%
categorical_features # não existem!!

# %%
df_all_clean.info()

# %%
df_all_clean.isnull().sum()

# %%
df_all_clean.describe()

# %%
# o last_minute_commits é sempre = 0 então não faz sentido
df_all_clean["last_minute_commits"].value_counts()

# %%
df_all_clean = df_all_clean.drop(columns=["last_minute_commits"])

# %%
# apagar tambem do numerical features
numerical_features.remove("last_minute_commits")

# %% [markdown]
# Vamos agora analisar o target

# %%
df_all_clean[target].describe()

# %%
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
sns.histplot(df_all_clean[target], kde=True)
plt.title(f'Distribuição de {target}')

plt.subplot(1, 2, 2)
sns.boxplot(x=df_all_clean[target])
plt.title(f'Boxplot de {target}')

plt.tight_layout()
plt.show()

# %%
df_all_clean[target].value_counts(normalize=True).sort_index()

# %%
print("\nAnálise Univariada das Features Numéricas:")
for col in numerical_features:
    plt.figure(figsize=(14, 4))

    plt.subplot(1, 3, 1)
    sns.histplot(df_all_clean[col], kde=True, bins=30)
    plt.title(f'Distribuição de {col}')
    plt.xlabel(col)
    plt.ylabel('Frequência')

    plt.subplot(1, 3, 2)
    sns.boxplot(y=df_all_clean[col]) # Usar y para boxplot vertical
    plt.title(f'Boxplot de {col}')
    plt.ylabel(col)

    plt.subplot(1, 3, 3)
    # Scatter plot com um jitter para melhor visualização se houver muitos pontos sobrepostos
    # e para ter uma ideia da relação com o índice (se interval for sequencial)
    if col == 'interval':
        plt.scatter(df_all_clean[col], df_all_clean.index, alpha=0.5)
    else:
        # Para outras features, pode ser útil um scatter com o índice para ver se há padrões
        plt.scatter(df_all_clean.index, df_all_clean[col], alpha=0.5)
    plt.title(f'Valores de {col} vs Índice')
    plt.xlabel('Índice da Amostra')
    plt.ylabel(col)


    plt.tight_layout()
    plt.show()

    skewness = df_all_clean[col].skew()
    kurt = df_all_clean[col].kurtosis()
    print(f"Skewness de {col}: {skewness:.2f}")
    print(f"Kurtosis de {col}: {kurt:.2f}")
    if abs(skewness) > 1:
        print(f"  -> {col} é consideravelmente assimétrica. Considere transformações (ex: log).")
    if df_all_clean[col].min() == 0 and df_all_clean[col].max() == 0 and col != 'last_minute_commits': # last_minute_commits é 0 no exemplo
        print(f"  -> ATENÇÃO: {col} tem todos os valores zero (ou apenas um valor após remoção da linha de erro). Verificar!")
    elif df_all_clean[col].nunique() == 1:
        print(f"  -> ATENÇÃO: {col} tem apenas um valor único. Não será útil para modelagem.")

# %% [markdown]
# - quase todas as suas features são altamente assimétricas à direita (skewness positiva e alta) e muitas têm alta kurtosis (distribuições com "caudas pesadas" e picos agudos ==> outliers)
# - branches_created é a exceção, com baixa skewness (0.43) e kurtosis negativa (-1.34, platicúrtica, mais "achatada" que a normal).
# - merges_to_main_branch tem uma skewness moderada (1.47).
# 
# VAMOS FAZER TRANFORMAÇÕES MAIS à FRENTE então

# %%
import math

# Definir número de colunas e calcular número de linhas necessário
n_cols = 2
n_rows = math.ceil(len(numerical_features) / n_cols)

fig, axes = plt.subplots(n_rows, n_cols, figsize=(n_cols * 6, n_rows * 4))
axes = axes.flatten()  # Para indexar como uma lista simples

for idx, col in enumerate(numerical_features):
    ax = axes[idx]
    correlation = df_all_clean[col].corr(df_all_clean[target])
    
    sns.regplot(
        x=df_all_clean[col],
        y=df_all_clean[target],
        ax=ax,
        line_kws={'color': 'red'},
        scatter_kws={'alpha': 0.3}
    )
    ax.set_title(f'{col} vs {target}')
    ax.set_xlabel(f'{col} (Corr: {correlation:.2f})')
    ax.set_ylabel(target)

# Ocultar eixos extras (caso existam)
for j in range(idx + 1, len(axes)):
    fig.delaxes(axes[j])

plt.tight_layout()
plt.show()


# %%
# Incluir a variável alvo na matriz de correlação
cols_for_corr = numerical_features + [target]
correlation_matrix = df_all_clean[cols_for_corr].corr()

plt.figure(figsize=(20, 16)) # Ajustar tamanho para melhor visualização
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5, annot_kws={"size": 8})
plt.title('Matriz de Correlação entre Features Numéricas e Target')
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()

print("\nCorrelações com a Variável Alvo (ordenadas):")
target_correlations = correlation_matrix[target].sort_values(ascending=False)
print(target_correlations)

# %% [markdown]
# - branches_created, merges to main branch, sum lines delected, sum lined added e total_commits parecem ser aquelas com menos influencia no target (-10%)
# - issue_particition e total issues assigned e issues resolved e total issues created oarece, por outro lado serem bastante pertinenentes
# - total comits e active days estão mesmo muito correlacionadas entre si, vamos entao eliminar aquele que menos influencia o target, ou seja, total commits
# - total merge requests e merged request estao tambem muito correlacionados entre si
# - total issues e issues resolved tambem

# %%
# Transformação de Features: --> nas que tinham skewness alta
# e que não eram todas iguais a zero
features_to_log_transform = [
    'total_commits', 'sum_lines_added', 'sum_lines_deleted',
    'sum_lines_per_commit', 'active_days', 'total_merge_requests',
    'merged_requests', 'review_comments_given', 'review_comments_received',
    'total_issues_created', 'total_issues_assigned', 'issues_resolved',
    'issue_participation', 'merges_to_main_branch' # Adicionar ou remover conforme sua análise
]
for col in features_to_log_transform:
    df_all_clean[col + '_log'] = np.log1p(df_all_clean[col])

# %% [markdown]
# e portanto vamos refazer a matriz de correlação

# %%
df_transformed = df_all_clean.copy() # Trabalhar em uma cópia

features_to_log_transform = [
    'total_commits', 'sum_lines_added', 'sum_lines_deleted',
    'sum_lines_per_commit', 'active_days', 'total_merge_requests',
    'merged_requests', 'review_comments_given', 'review_comments_received',
    'total_issues_created', 'total_issues_assigned', 'issues_resolved',
    'issue_participation', 'merges_to_main_branch'
    # 'last_minute_commits' não foi incluída aqui pois era 0 nos seus dados de exemplo.
    # Se tiver variância e for assimétrica, adicione-a.
]


for col in features_to_log_transform:
    df_transformed[col + '_log'] = np.log1p(df_transformed[col])

print("\nColunas após a transformação:", df_transformed.columns.tolist())


# --- Agora, vamos montar a lista de colunas para a nova matriz de correlação ---

target = 'Final Grade'
cols_for_new_corr = []

# Adicionar as versões logarítmicas das features transformadas
for original_col_name in features_to_log_transform:
    log_col_name = original_col_name + '_log'
    if log_col_name in df_transformed.columns: # Verifica se a coluna _log foi realmente criada
        cols_for_new_corr.append(log_col_name)


# Adicionar features originais que NÃO foram transformadas
# (exclua a variável alvo e as que já tiveram sua versão _log adicionada)
all_original_features = [col for col in df_all_clean.columns if col != target and col not in features_to_log_transform]

for col in all_original_features:
    if col in df_transformed.columns: # Verifica se a coluna original ainda está lá (deveria estar)
        cols_for_new_corr.append(col)

# Adicionar a variável alvo
if target in df_transformed.columns:
    cols_for_new_corr.append(target)
else:
    print(f"Aviso: Variável alvo '{target}' não encontrada no DataFrame.")


# Remover duplicatas caso alguma coluna tenha sido adicionada duas vezes (improvável com esta lógica)
cols_for_new_corr = sorted(list(set(cols_for_new_corr))) # Ordenar para consistência
# Re-garantir que o target está no final, se existir
if target in cols_for_new_corr:
    cols_for_new_corr.remove(target)
    cols_for_new_corr.append(target)

print("\nColunas selecionadas para a nova matriz de correlação:")
print(cols_for_new_corr)

# Verificar se há colunas suficientes para calcular a correlação
if len(cols_for_new_corr) < 2:
    print("Não há colunas suficientes para calcular a matriz de correlação.")
else:
    # Calcular a nova matriz de correlação
    new_correlation_matrix = df_transformed[cols_for_new_corr].corr()

    # Plotar a nova matriz de correlação
    plt.figure(figsize=(22, 18)) # Ajuste o tamanho conforme necessário
    sns.heatmap(new_correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5, annot_kws={"size": 7}) # Ajustar tamanho da anotação
    plt.title('Nova Matriz de Correlação (Features Log-Transformadas e Não Transformadas vs Target)')
    plt.xticks(rotation=45, ha='right', fontsize=9) # Ajustar tamanho da fonte dos ticks
    plt.yticks(rotation=0, fontsize=9) # Ajustar tamanho da fonte dos ticks
    plt.tight_layout()
    plt.show()

    # Mostrar as correlações com a variável alvo
    if target in new_correlation_matrix.columns:
        print("\nNovas Correlações com a Variável Alvo (ordenadas):")
        print(new_correlation_matrix[target].sort_values(ascending=False))
    else:
        print(f"Variável alvo '{target}' não encontrada na matriz de correlação calculada.")

# %% [markdown]
# análise:
# - Melhora nas Correlações com Final Grade para Métricas de Volume:
#     - sum_lines_added_log vs Final Grade: 0.07 (antes era 0.02)
#     - sum_lines_deleted_log vs Final Grade: 0.05 (antes era 0.01)
#     - total_commits_log vs Final Grade: 0.05 (antes era 0.08, aqui houve uma pequena redução, mas ainda fraca)
#     - sum_lines_per_commit_log vs Final Grade: 0.06 (antes era 0.08)
# 
# ao reduzir o impacto dos outliers e a assimetria, uma relação (ainda que fraca) com a nota final começou a aparecer para algumas dessas métricas de volume que antes estavam quase em zero.
# 
# - Features de "Issue" Continuam Fortes (e algumas melhoraram):
#     - total_issues_created_log vs Final Grade: 0.39 (era 0.32) - Agora é a mais forte!
#     - issues_resolved_log vs Final Grade: 0.38 (era 0.33)
#     - issue_participation_log vs Final Grade: 0.36 (era 0.34)
#     - total_issues_assigned_log vs Final Grade: 0.31 (era 0.34, pequena redução)
# 
# - merged_requests_log vs Final Grade: 0.19 (era 0.16)
# - review_comments_given_log vs Final Grade: 0.17 (era 0.18)
# 

# %%
numerical_features

# %%
# vamos remover sum_lines_per_commit_log
df_all_clean = df_all_clean.drop(columns=["sum_lines_per_commit_log"])
df_transformed = df_transformed.drop(columns=["sum_lines_per_commit_log"])
df_all_clean = df_all_clean.drop(columns=["sum_lines_per_commit"])
df_transformed = df_transformed.drop(columns=["sum_lines_per_commit"])
numerical_features.remove("sum_lines_per_commit")

# %% [markdown]
# Ratios Chave (usando as features originais e depois aplicando log, ou usando as features log já calculadas se a matemática permitir e fizer sentido):

# %%
# DataFrame a ser usado (garanta que é o que tem as colunas _log)
df_engineered = df_transformed.copy()
epsilon = 1e-6 # Caso não tenha sido definido antes

# --- 1. REMOVER REDUNDÂNCIA PERFEITA ---
# sum_lines_per_commit_log é perfeitamente correlacionado com sum_lines_added_log
feature_to_remove_perfect_corr = 'sum_lines_per_commit_log'
if feature_to_remove_perfect_corr in df_engineered.columns:
    df_engineered.drop(columns=[feature_to_remove_perfect_corr], inplace=True)
    print(f"Coluna removida devido à correlação perfeita: {feature_to_remove_perfect_corr}")
else:
    print(f"Aviso: Coluna {feature_to_remove_perfect_corr} não encontrada para remoção.")

# --- 2. LISTA INICIAL DE FEATURES A MANTER/CRIAR ---
# Começamos com as que não foram transformadas ou as transformadas que não são parte de ratios óbvios ainda.

# Features originais não transformadas (ou com baixa skewness)
initial_selected_features = ['interval', 'branches_created']

# Features logarítmicas que manteremos (seleção baseada na análise da matriz de correlação)
# Bloco Commits/Linhas (excluindo sum_lines_per_commit_log e active_days_log devido à alta corr com total_commits_log)
log_features_commits_lines = [
    'total_commits_log',       # Mantendo este como representante de 'active_days_log'
    'sum_lines_added_log',
    'sum_lines_deleted_log'
]

# Bloco Issues (total_issues_assigned_log e issues_resolved_log são muito altos com total_issues_created_log)
# Vamos focar em criar um ratio de resolução e manter 'total_issues_created_log' e 'issue_participation_log'
log_features_issues = [
    'total_issues_created_log',
    'issue_participation_log'
    # 'issues_resolved_log' e 'total_issues_assigned_log' serão usados para criar um ratio
]

# Bloco Merge Requests (total_merge_requests_log e merged_requests_log são muito altos)
# Vamos criar um ratio de merge
# Se for manter uma, 'total_merge_requests_log' ou 'merged_requests_log' (a segunda tem corr ligeiramente maior com target)

# Bloco Review Comments (review_comments_given_log e review_comments_received_log são muito altos)
# Vamos criar uma feature de atividade total de review ou escolher uma.
# Por agora, podemos manter 'review_comments_given_log' (ligeiramente maior corr com target do que a received)
log_features_reviews = ['review_comments_given_log'] # ou 'review_comments_received_log' ou uma combinada

# Outras features log
log_features_other = ['merges_to_main_branch_log']


# Combinar as listas de features log
selected_log_features = log_features_commits_lines + log_features_issues + log_features_reviews + log_features_other

# Verificar se todas as features selecionadas existem no df_engineered
final_selection_base = []
for col in initial_selected_features + selected_log_features:
    if col in df_engineered.columns:
        final_selection_base.append(col)
    else:
        print(f"Aviso: Coluna selecionada '{col}' não encontrada em df_engineered.")

print("\nFeatures base selecionadas antes da engenharia de ratios:")
print(final_selection_base)

# Adicionar o target para análises futuras, mas não para a modelagem direta como feature
if target not in final_selection_base and target in df_engineered.columns:
    print(f"(Variável alvo '{target}' será mantida separadamente)")

# Criar um DataFrame apenas com estas features base + target para facilitar
# df_base_for_ratios = df_engineered[final_selection_base + [target]].copy()
# No entanto, para criar ratios, precisamos das colunas ORIGINAIS (não log)
# Então vamos trabalhar com df_engineered, que tem tudo.

# %%
print("\n--- Iniciando Engenharia de Features (Ratios e Combinadas) ---")

# --- Ratios ---
# Usar as colunas ORIGINAIS para calcular ratios, depois aplicar log1p se necessário

# 1. Ratio de Merge Requests
# Precisamos das colunas originais: 'merged_requests' e 'total_merge_requests'
if 'merged_requests' in df_engineered.columns and 'total_merge_requests' in df_engineered.columns:
    df_engineered['merged_ratio'] = df_engineered['merged_requests'] / (df_engineered['total_merge_requests'] + epsilon)
    df_engineered['merged_ratio_log'] = np.log1p(df_engineered['merged_ratio'])
    final_selection_base.append('merged_ratio_log') # Adicionar à nossa lista de features finais
    print("Feature 'merged_ratio_log' criada.")
else:
    print("Aviso: Colunas para 'merged_ratio' não encontradas.")

# 2. Ratio de Resolução de Issues
# Precisamos de 'issues_resolved' e 'total_issues_assigned' (ou 'total_issues_created')
if 'issues_resolved' in df_engineered.columns and 'total_issues_assigned' in df_engineered.columns:
    df_engineered['issue_resolution_rate_assigned'] = df_engineered['issues_resolved'] / (df_engineered['total_issues_assigned'] + epsilon)
    df_engineered['issue_resolution_rate_assigned_log'] = np.log1p(df_engineered['issue_resolution_rate_assigned'])
    final_selection_base.append('issue_resolution_rate_assigned_log')
    print("Feature 'issue_resolution_rate_assigned_log' criada.")
else:
    print("Aviso: Colunas para 'issue_resolution_rate_assigned' não encontradas.")

if 'issues_resolved' in df_engineered.columns and 'total_issues_created' in df_engineered.columns:
    df_engineered['issue_resolution_rate_created'] = df_engineered['issues_resolved'] / (df_engineered['total_issues_created'] + epsilon)
    df_engineered['issue_resolution_rate_created_log'] = np.log1p(df_engineered['issue_resolution_rate_created'])
    # Poderíamos adicionar esta também, ou escolher uma. Por agora, vamos adicionar para análise.
    final_selection_base.append('issue_resolution_rate_created_log')
    print("Feature 'issue_resolution_rate_created_log' criada.")
else:
    print("Aviso: Colunas para 'issue_resolution_rate_created' não encontradas.")


# 3. Commits por Dia Ativo
if 'total_commits' in df_engineered.columns and 'active_days' in df_engineered.columns:
    df_engineered['commits_per_active_day'] = df_engineered['total_commits'] / (df_engineered['active_days'] + epsilon)
    df_engineered['commits_per_active_day_log'] = np.log1p(df_engineered['commits_per_active_day'])
    final_selection_base.append('commits_per_active_day_log')
    print("Feature 'commits_per_active_day_log' criada.")
else:
    print("Aviso: Colunas para 'commits_per_active_day' não encontradas.")


# --- Features Combinadas ---
# 1. Atividade Total de Review (soma dos dados originais, depois log)
if 'review_comments_given' in df_engineered.columns and 'review_comments_received' in df_engineered.columns:
    df_engineered['total_review_activity'] = df_engineered['review_comments_given'] + df_engineered['review_comments_received']
    df_engineered['total_review_activity_log'] = np.log1p(df_engineered['total_review_activity'])
    final_selection_base.append('total_review_activity_log')
    # Como criamos esta, podemos remover 'review_comments_given_log' da seleção base se ela estiver lá
    if 'review_comments_given_log' in final_selection_base:
        final_selection_base.remove('review_comments_given_log')
        print("Substituindo 'review_comments_given_log' por 'total_review_activity_log'.")
    print("Feature 'total_review_activity_log' criada.")
else:
    print("Aviso: Colunas para 'total_review_activity' não encontradas.")


# Limpar a lista final_selection_base de possíveis duplicatas e garantir que são colunas existentes
final_engineered_features = []
for col in sorted(list(set(final_selection_base))): # Ordenar para consistência
    if col in df_engineered.columns:
        final_engineered_features.append(col)
    else:
        print(f"Aviso pós-engenharia: Coluna '{col}' não encontrada em df_engineered.")

print("\nFeatures finais selecionadas após engenharia:")
print(final_engineered_features)

# Criar o DataFrame final para modelagem (apenas features selecionadas)
X_final = df_engineered[final_engineered_features].copy()
y_final = df_engineered[target].copy()

print("\nDimensões de X_final:", X_final.shape)
print("Primeiras linhas de X_final:")
print(X_final.head())

# %%
# Calcular a nova matriz de correlação com as features engenheiradas
# Adicionar o target temporariamente para a matriz de correlação
df_for_corr_plot = X_final.copy()
df_for_corr_plot[target] = y_final

correlation_matrix_engineered = df_for_corr_plot.corr()

plt.figure(figsize=(24, 20)) # Ajuste o tamanho conforme necessário
sns.heatmap(correlation_matrix_engineered, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5, annot_kws={"size": 8})
plt.title('Matriz de Correlação Final (Features Engenheiradas vs Target)')
plt.xticks(rotation=45, ha='right', fontsize=9)
plt.yticks(rotation=0, fontsize=9)
plt.tight_layout()
plt.show()

print("\nCorrelações Finais com a Variável Alvo (ordenadas):")
print(correlation_matrix_engineered[target].sort_values(ascending=False))

# Remover a coluna target de df_for_corr_plot se você for usar X_final depois sem ela
# X_final já está correto (sem target)

# %%
# total_commits_log, sum_lines_added_log, sum_lines_deleted_log, e commits_per_active_day_log. 
# Todos altamente correlacionados entre si e com correlações muito baixas com Final Grade.
#  e removeria as outras três deste bloco (total_commits_log, sum_lines_deleted_log, commits_per_active_day_log).
df_engineered = df_engineered.drop(columns=["total_commits_log", "sum_lines_deleted_log", "commits_per_active_day_log"])

# %%
df_engineered

# %%
df_engineered.columns
# output: Index(['interval', 'total_commits', 'sum_lines_added', 'sum_lines_deleted',
#       'active_days', 'total_merge_requests', 'merged_requests',
#       'review_comments_given', 'review_comments_received',
#       'total_issues_created', 'total_issues_assigned', 'issues_resolved',
#       'issue_participation', 'branches_created', 'merges_to_main_branch',
#       'Final Grade', 'active_days_log', 'total_merge_requests_log',
#       'merged_requests_log', 'review_comments_given_log',
#       'review_comments_received_log', 'total_issues_created_log',
#       'total_issues_assigned_log', 'issues_resolved_log',
#       'issue_participation_log', 'merges_to_main_branch_log', 'merged_ratio',
#       'merged_ratio_log', 'issue_resolution_rate_assigned',
#       'issue_resolution_rate_assigned_log', 'issue_resolution_rate_created',
#       'issue_resolution_rate_created_log', 'commits_per_active_day',
#       'total_review_activity', 'total_review_activity_log'],
#      dtype='object')

# %%
# Features finais DESEJADAS para o modelo
# Esta lista é construída com base em:
# 1. Boa correlação com 'Final Grade'.
# 2. Representar um conceito único ou ser o melhor representante de um bloco de features.
# 3. Já estarem na escala logarítmica (se aplicável) ou serem features que não precisaram de log.

features_finais_para_X_modelo = [
    # Features de Issues (as mais fortes consistentemente)
    'total_issues_created_log',          # Corr ~0.39 com target
    'issue_participation_log',           # Corr ~0.36 com target
    'issue_resolution_rate_created_log', # Corr ~0.23 com target (melhor ratio de resolução)

    # Features de Review e Merge (moderadas)
    'total_review_activity_log',         # Corr ~0.16 com target (combinada)
    'merged_ratio_log',                  # Corr ~0.15 com target (ratio)

    # Representante do Bloco de Código/Commits (a melhorzinha das fracas, para não perder o sinal)
    'sum_lines_added_log',               # Corr ~0.07 com target

    # Features com baixa correlação mas que podem ser exploradas por modelos baseados em árvores
    'interval',                          # Original, sem log (se for tratada como categórica ordinal)
    'branches_created',                  # Original, sem log (baixa skewness)
]

print("Lista de features finais desejadas para X_modelo:")
print(features_finais_para_X_modelo)

# %%
len(features_finais_para_X_modelo)

# %%
# Verificar se todas as features desejadas estão presentes em df_engineered
todas_presentes = True
for feature_desejada in features_finais_para_X_modelo:
    if feature_desejada not in df_engineered.columns:
        print(f"ATENÇÃO: Feature desejada '{feature_desejada}' NÃO está em df_engineered.columns!")
        todas_presentes = False

if todas_presentes:
    print("\nTodas as features desejadas estão presentes em df_engineered.")
else:
    print("\nPROBLEMA: Nem todas as features desejadas estão em df_engineered. Verifique os passos anteriores.")
    print("Colunas atuais em df_engineered:", df_engineered.columns.tolist())

# %%



