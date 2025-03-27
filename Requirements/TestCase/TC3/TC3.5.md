**Test Case ID:** TC3.5

**Test Case Description:** O sistema deve exibir a previsão de desempenho por categorias para um grupo específico.

**Related Use Cases**: UC3.2

**Pre-conditions**:
- O professor deve estar autenticado no sistema (dependente do US1). 
- O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6).

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Previsão de Desempenho por Categorias".
- O sistema exibe as previsões categorizadas de todos os aluno (histórico).
- O professor seleciona um grupo especifico nos filtros.
- O sistema exibe apenas as previsões desse grupo.
- O professor pode aplicar filtros adicionais.
- O sistema ajusta automaticamente a exibição.

**Expected Result**:
- O sistema deve exibir a informação detalhada das previsões para o grupo selecionado.
- O sistema deve exibir um gráfico ou outro tipo de visualização para facilitar a comparação.

**Actual Result**: