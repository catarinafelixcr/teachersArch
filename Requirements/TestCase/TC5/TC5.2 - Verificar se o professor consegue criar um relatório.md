Test Case ID: TC5.2  
Test Case Description: Verificar se o professor consegue criar um relatório personalizado sobre a produtividade dos grupos e gerar um arquivo visual ou para download.  

Related Use Cases: UC5.2 - Criar um relatório personalizado de produtividade dos grupos.  

Pre-conditions:
- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso aos dados sobre a produtividade dos alunos, incluindo previsões baseadas no modelo de Machine Learning.  

Steps:  
1. Aceder à dashboard.  
2. Selecionar a opção "Ver desempenho de diferentes grupos em trabalhos".  
3. Visualizar a lista de todos os grupos com dados históricos.  
4. Selecionar a opção para gerar um relatório personalizado.  
5. Escolher os filtros desejados, incluindo:  
   - Período de tempo (semana, mês, trimestre).  
   - Métricas a incluir (número de commits, tempo médio por tarefa, percentual de conclusão, etc.).  
   - Grupo(s) específico(s) ou todos.  
6. Clicar em "Gerar Relatório".  
7. O sistema gera o relatório e exibe as métricas solicitadas em formato visual (gráficos, tabelas) ou oferece opções de download (PDF/Excel).  
8. O professor visualiza ou compartilha o relatório com os alunos ou com a administração.  

Expected result:  
- O sistema gera um relatório com os filtros aplicados e apresenta as informações em gráficos/tabelas.  
- O professor pode baixar o relatório em PDF ou Excel.  
- O professor pode compartilhar o relatório com alunos ou com a administração.  

Extensions:  

5a. O professor escolhe filtros inválidos. 
- 5a1. O sistema exibe a mensagem de erro: "Filtro inválido selecionado. Verifique as opções e tente novamente."  
- 5a2. O professor ajusta os filtros e tenta novamente.  

6a. O sistema não consegue gerar o relatório devido à falta de dados.
- 6a1. O sistema exibe a mensagem: "Não há dados suficientes para gerar o relatório."  
- 6a2. O professor pode optar por gerar um relatório com dados parciais ou esperar pela atualização dos dados.
