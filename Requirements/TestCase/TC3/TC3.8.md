**Test Case ID:** TC3.8

**Test Case Description:** Verificar se o sistema permite visualizar a comparação detalhada das previsões de um aluno específico.

**Related Use Cases**: UC3.3

**Pre-conditions**:
- O professor deve estar autenticado no sistema (dependente do US1). 
- O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6).

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Performance Overview by Category".

**Expected Result**:
- O sistema sofre um erro técnico e falha ao exibir as visualizações interativas.
- O sistema exibe uma mensagem "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."

**Actual Result**: