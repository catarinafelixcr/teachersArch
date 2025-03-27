**Test Case ID**: TC3.7

**Test Case Description**: O sistema gera um relatório de desempenho por categorias.

**Related Use Cases**: UC3.3

**Pre-conditions**:
- O professor deve estar autenticado no sistema (dependente do US1). 
- O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6).

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Previsão de Desempenho por Categorias".   
- O sistema exibe as previsões categorizadas de todos os aluno (histórico).  
- O professor seleciona os filtros que desejar.
- O professor escolhe a opção "Gerar Relatório".
- O sistema gera o relatório com filtros que tinham sido selecionados em formato PDF.

**Expected Result:**
- O sistema deve exibir estatísticas comparativas dos grupos (média, desvio padrão, variação).
- O sistema deve apresentar a distribuição gráfica das previsões de notas.

**Actual Result**: