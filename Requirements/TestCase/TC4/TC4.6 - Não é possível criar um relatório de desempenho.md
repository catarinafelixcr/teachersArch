**Test case ID**: TC4.6  

**Test case description**: Verificar o comportamento do sistema quando não é possível gerar e descarregar o relatório de desempenho dos alunos em risco de reprovação.  

**Related Use Cases**: UC4.3 - Gerar relatório de desempenho por categorias.  

**Pre-conditions**:  
- O professor deve estar autenticado no sistema.  
- O sistema não tem acesso às previsões de desempenho ou ocorre uma falha na geração do relatório.  

**Steps**:  
- Aceder à dashboard.  
- Selecionar a opção "Relatório de Alunos em Risco".  
- O sistema tenta exibir a lista de alunos identificados como "em risco".  
- Aplicar os filtros desejados (por exemplo, grupo, percentagem de risco).  
- Selecionar a opção "Gerar Relatório".  
- O sistema tenta processar o relatório.  

**Expected result**:  
- O sistema exibe uma mensagem informando que não foi possível gerar o relatório.  
- Nenhum ficheiro PDF é disponibilizado para download.  

**Actual result**:
