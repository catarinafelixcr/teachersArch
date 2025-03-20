**Test Case ID**: TC5.1.4  

**Test Case Description**: Verificar se o sistema exibe a mensagem informativa correta quando todos os grupos apresentam produtividade considerada satisfatória.

**Related Use Cases**: UC5.1 - Ver a previsão desempenho de diferentes grupos em trabalhos.

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso aos dados dos alunos e previsões de produtividade.  
- Nenhum grupo no sistema deve ser classificado como de baixa produtividade (configurar dados de teste ou usar dados reais onde todos os grupos tenham produtividade satisfatória).  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Ver desempenho de Grupos em Trabalhos". 

**Expected Result**:  

- O sistema deve exibir a página de "Desempenho de Grupos em Trabalhos".  
- Em vez de destacar grupos de baixa produtividade, o sistema deve exibir uma mensagem clara e informativa indicando que não há grupos com baixa produtividade.  
- A mensagem deve ser semelhante a: "Todos os grupos apresentam produtividade satisfatória.". 
- Se a lista de grupos for apresentada, nenhum grupo deve estar visualmente destacado como de baixa produtividade.  

**Actual Result**:

