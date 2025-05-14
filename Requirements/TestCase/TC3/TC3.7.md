**Test Case ID**: TC3.7

**Test Case Description**: O sistema gera um relatório de desempenho por categorias.

**Related Use Cases**: UC3.3

**Pre-conditions**:
- O professor deve estar autenticado no sistema (dependente do US1). 
- O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6).

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Performance Overview by Category".   
- O sistema exibe as previsões categorizadas de todos os aluno do grupo (histórico).  
- O professor escolhe a opção "Generate Report".
- O sistema gera o relatório em formato PDF.

**Expected Result:**
- O sistema deve exibir estatísticas comparativas dos grupos ("TOTAL PREDICTIONS", "AVERAGE GRADE", "STANDARD DEVIATION", "HIGHEST PREDICTED GRADE", "LOWEST PREDICTED GRADE").
- O sistema deve apresentar a distribuição gráfica das previsões de notas.

**Actual Result**:

Funciona
