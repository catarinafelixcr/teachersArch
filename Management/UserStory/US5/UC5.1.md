UC.5.1. Ver quais são os alunos com previsão de reprovação

Primary Actor: Professor.

Scope: O sistema permite que os professores visualizem métricas de trabalhos realizados pelos alunos, como tempo aplicado e evolução das metas do trabalho.

Level: User goals – Sea level

Stakeholders: Professor, alunos, instituição de ensino e modelo ML.

Preconditions: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos, incluindo previsões de produtividade baseadas no modelo de Machine Learning.


Main Success Scenario:  
      
1. O professor entra na plataforma e seleciona uma turma.
           
2. O professor vê uma lista com todos os grupos da turma.
     
3. O professor seleciona a opção para visualizar a produtividade dos grupos e o sistema exibe métricas de produtividade, como número de commits, tempo médio por tarefa e percentual de conclusão.
      
4. O professor vê quais grupos têm menor produtividade (destacados a vermelho).

5. O professor clica num grupo para obter mais detalhes sobre a colaboração entre os membros.


Extensions:

3a. O modelo ML não retorna previsões.
3a1. O sistema exibe uma mensagem mostrando que os dados de produtividade não estão disponíveis.
      
4a. Todos os grupos apresentam produtividade satisfatória.
4a1. O sistema exibe uma mensagem mostrando que não há grupos com baixa produtividade.
