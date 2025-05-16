UC2.1. Visualizar a previsão de notas dos alunos de um grupo.

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar a previsão de notas de todos os alunos consultadas até ao dia.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (precisa de compreender o desempenho previsto para adaptar as suas estratégias), alunos (beneficiam de avaliações e abordagens adequadas ao seu nível), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning (dependente do US6). 

**Main Success Scenario**:  
1. O professor acede à página inicial;
2. Seleciona a opção "Prediciton of Grades";
3. O professor seleciona o grupo que quer analisar.
4. O sistema exibe o histórico das previsões para todos os alunos;
5. O sistema apresenta estatísticas globais (Total predictions, Average Grade, Standar Deviation, Highest Predicted Grade e Lowest Predicted Grade);
6. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.

**Extensions**:

3a. Não existe histórico de previsões.
- 3a1. O sistema exibe uma mensagem equivalente a "No grade predictions available."
 