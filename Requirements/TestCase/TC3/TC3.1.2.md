**Test Case ID:** TC3.1.2

**Test Case Description:** Verificar o comportamento do sistema quando ocorre uma falha inesperada durante a comparação detalhada das previsões de um aluno específico.

**Related Use Cases**: UC3.1

**Pre-conditions**:
- O professor deve estar autenticado no sistema. 
- O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US1 e US6).

**Steps**:
- O professor está na dashboard;
- O professor seleciona a opção "Previsão de Desempenho por Categorias";

**Expected Result**:
- O sistema sofre um erro técnico e falha ao exibir as visualizações interativas.
- O sistema exibe uma mensagem "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."

**Actual Result**: