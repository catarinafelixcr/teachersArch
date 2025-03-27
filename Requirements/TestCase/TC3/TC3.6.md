**Test Case ID:** TC3.6

**Test Case Description:** Verificar o comportamento do sistema quando ocorre uma falha inesperada durante a visualização detalhada das previsões de um grupo específico.

**Related Use Cases**: UC3.2

**Pre-conditions**:
- O professor deve estar autenticado no sistema (dependente do US1). 
- O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6).

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Previsão de Desempenho por Categorias".
- O sistema exibe as previsões categorizadas de todos os aluno (histórico).
- O professor seleciona um grupo especifico nos filtros.

**Expected Result**:
- O sistema sofre um erro técnico e falha ao exibir as visualizações interativas.
- O sistema exibe uma mensagem "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."

**Actual Result**: