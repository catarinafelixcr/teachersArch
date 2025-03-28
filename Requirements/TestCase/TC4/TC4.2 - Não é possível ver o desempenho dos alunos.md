**Test case ID**: TC4.2  

**Test case description**: Testar o comportamento do sistema quando não existem dados para a exibição da previsão do desempenho dos alunos e para identificação dos alunos em situação de risco de reprovação. 

**Related Use Cases**: UC4.1 - Ver o desempenho dos alunos.  

**Pre-conditions**:  
- O professor deve estar autenticado no sistema.  
- O sistema não tem previsões disponíveis ou os dados são insuficientes para análise.  

**Steps**:  
- Aceder à dashboard.  
- Selecionar "Prever o desempenho".  
- O sistema carregar os dados.  

**Expected result**:  
- O sistema exibe uma mensagem informando que não há dados suficientes para análise.  
- Nenhuma informação sobre desempenho dos alunos é apresentada.  

**Actual result**:
