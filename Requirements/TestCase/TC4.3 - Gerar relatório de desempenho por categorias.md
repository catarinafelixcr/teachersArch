**Test case ID**: TC4.3  

**Test case description**: Verificar se o professor consegue gerar e descarregar um relatório de desempenho dos alunos em risco de reprovação.  

**Related Use Cases**: UC4.3 - Gerar relatório de desempenho por categorias.  

**Pre-conditions**:  
- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso às previsões de desempenho geradas pelo modelo de Machine Learning.  

**Steps**:  
- Aceder à dashboard.  
- Selecionar a opção "Relatório de Alunos em Risco".  
- O sistema exibe a lista de alunos identificados como "em risco".  
- Aplicar os filtros desejados (por exemplo, grupo, percentagem de risco, disciplina).  
- Selecionar a opção "Gerar Relatório".  
- O sistema gera o relatório e apresenta a opção para descarregar em formato PDF.  
- O professor descarrega o relatório.  

**Expected result**:  
- O sistema exibe corretamente a lista de alunos em risco.  
- Os filtros são aplicados corretamente, ajustando os dados apresentados.  
- O relatório é gerado com os dados filtrados e disponibilizado para download em PDF.  

**Actual result**:
