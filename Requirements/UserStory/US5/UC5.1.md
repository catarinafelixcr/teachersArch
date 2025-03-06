UC.5.1. Ver o desempenho de diferentes grupos em trabalhos.

**Primary Actor**: Professor.

**Scope/Goal**: O sistema permite que os professores visualizem métricas de trabalhos realizados pelos alunos, como tempo aplicado e evolução das metas do trabalho.

**Level**: User goals (Sea level).

**Stakeholders**:
        
      Professor: Avaliar a colaboração dos grupos e identificar os que precisam de mais apoio.
        
      Alunos: Mostrar o seu desempenho.
        
      Instituição de Ensino: Acompanhar o progresso dos alunos e da turma.
        
      Sistema de Previsão: Modelo ML.

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos, incluindo previsões de produtividade baseadas no modelo de Machine Learning.
Main Success Scenario:
        
      O professor entra na plataforma e seleciona uma turma.
        
      O professor vê uma lista com todos os grupos da turma.
        
      O professor seleciona a opção para visualizar a produtividade dos grupos e o sistema exibe métricas de produtividade, como número de commits, tempo médio por tarefa e percentual de conclusão.
        
      O professor vê quais grupos têm menor produtividade (destacados a vermelho).

      O professor clica num grupo para obter mais detalhes sobre a colaboração entre os membros.

**Extensions**:
3a. O modelo ML não retorna previsões.

- 3a1. O sistema exibe uma mensagem mostrando que os dados de produtividade não estão disponíveis.

4a. Todos os grupos apresentam produtividade satisfatória.

- 4a1. O sistema exibe uma mensagem mostrando que não há grupos com baixa produtividade.	
