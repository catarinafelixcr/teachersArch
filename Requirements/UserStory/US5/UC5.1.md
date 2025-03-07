UC5.1. Ver a previsão desempenho de diferentes grupos em trabalhos.

**Primary Actor**: Professor.

**Scope**: O sistema permite que os professores visualizem métricas de trabalhos realizados pelos alunos, como tempo aplicado e evolução das metas do trabalho.

**Level**: User goals (Sea level).

**Stakeholders**: Professor (pretende avaliar a colaboração dos grupos e identificar os que precisam de mais apoio), alunos (mostrar o seu desempenho), instituição de ensino (acompanhar o progresso dos alunos e do grupo)

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos, incluindo previsões de produtividade baseadas no modelo de Machine Learning (depende do US6). 

**Main Success Scenario**:

1. O professor entra na dashboard;
2. Seleciona a opção "Ver desempenho de diferentes grupos em trabalhos";
2. O professor vê uma lista com todos os grupos (historico);
3. O professor seleciona a opção para visualizar a produtividade dos grupos e o sistema exibe métricas de produtividade, como número de commits, tempo médio por tarefa e percentual de conclusão;
4. O professor vê quais grupos têm menor produtividade (destacados a vermelho);
5. O professor clica num grupo para obter mais detalhes sobre a colaboração entre os membros.


**Extensions**:

5a. Todos os grupos apresentam produtividade satisfatória. 
- 5a1. O sistema exibe uma mensagem que mostra que não há grupos com baixa produtividade.