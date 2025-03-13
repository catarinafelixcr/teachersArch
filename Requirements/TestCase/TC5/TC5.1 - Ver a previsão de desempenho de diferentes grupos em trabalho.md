Test Case ID:TC5.1  
Test Case Description: Verificar se o professor consegue ver a previsão de desempenho de diferentes grupos em trabalhos e identificar corretamente aqueles com menor produtividade.  

Related Use Cases: UC5.1 - Ver a previsão de desempenho de diferentes grupos em trabalhos.  

Pre-conditions:
- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso aos dados dos alunos, incluindo previsões de produtividade baseadas no modelo de Machine Learning.  

Steps: 
1. Aceder à dashboard.  
2. Selecionar a opção "Ver desempenho de diferentes grupos em trabalhos".  
3. Visualizar a lista de todos os grupos com dados históricos.  
4. Ativar a opção para visualizar métricas de produtividade dos grupos.  
5. Observar os grupos com menor produtividade destacados a vermelho.  
6. Clicar num grupo para ver detalhes adicionais sobre a colaboração entre os membros.  

Expected result: 
- O sistema exibe a lista de grupos com as métricas de produtividade.  
- Os grupos com menor produtividade são destacados a vermelho.  
- Ao clicar num grupo, o sistema apresenta detalhes adicionais sobre a colaboração entre os membros.  

Extensions: 
5a. Todos os grupos apresentam produtividade satisfatória. 
- O sistema exibe uma mensagem informando que não há grupos com baixa produtividade.
