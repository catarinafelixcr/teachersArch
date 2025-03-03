UC.2.1. Ver quais são os alunos com previsão de reprovação

Primary Actor: Professor.

Scope: O sistema permite que os professores visualizem os alunos, destacando a vermelho aqueles com previsão de reprovação, para facilitar a identificação de quem precisa de mais atenção.

Level: User goals – Sea level

Stakeholders: Professor, alunos, instituição de ensino e sistema de Previsão (modelo de ML).

Preconditions: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos, incluindo previsões de reprovação baseadas no modelo de Machine Learning.


Main Success Scenario:  
      
1. O professor entra na plataforma e seleciona uma turma.
2. O profesor vê as notas de todos os alunos da turma.
     
3. O professor seleciona a opção para prever quem vai reprovar.
      
4. O sistema mostra os dados previstos pelo modelo de ML. Os alunos com previsão de reprovação são destacados a vermelho.

5. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.


Extensions:

3a. O modelo de ML não retorna previsões.

3a1. O sistema exibe uma mensagem a infomar que as previsões não estão disponíveis.
      
4a. Nenhum aluno está previsto para reprovação.
4a1. O sistema exibe uma mensagem a informar que não há alunos em risco nesta turma.
