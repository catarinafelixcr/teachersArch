**Test case ID**: TC4.1

**Test case description**: Verificar se o professor consegue visualizar a previsão de desempenho dos alunos e se consegue identificar corretamente os alunos em risco de reprovação.

**Related Use Cases**: UC4.1 - Ver o desempenho dos alunos.

**Pre-conditions**:

- O professor deve estar autenticado no sistema.
- O sistema deve ter previsões sobre o desempenho dos alunos disponíveis.

**Steps**:

- Aceder à dashboard.
- Selecionar "Student at Risk".
- Selecionar o Grupo
- Clicar num aluno para ver detalhes adicionais.

**Expected result**:

- O sistema exibe os alunos do grupo.
- O sistema exibe categorias para filtrar o grupo ("High Risk", "Medium Risk", "Low Risk", "No Risk")
- Ao clicar num aluno, o sistema apresenta detalhes adicionais.

**Actual result**: