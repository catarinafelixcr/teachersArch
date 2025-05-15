**Test case ID**: TC4.5  

**Test case description**: Verificar o comportamento do sistema quando não há dados suficientes para visualizar o desempenho dos grupos e identificar alunos em risco de reprovação.  

**Related Use Cases**: UC4.2 - Ver o desempenho dos Grupos.  

**Pre-conditions**:  
- O professor deve estar autenticado no sistema.  
- O sistema não tem previsões disponíveis ou os dados dos grupos são insuficientes para análise.  

**Steps**:  
- Aceder à dashboard.  
- Selecionar a opção "Student at Risk".  
- Selecionar um grupo para análise.  
- O sistema tenta carregar os dados.  

**Expected result**:  
- O sistema exibe não exibe informação nenhuma (apenas um erro na consola "Error fetching predictions:")  
- Nenhuma informação sobre desempenho dos grupos é apresentada.  

**Actual result**: