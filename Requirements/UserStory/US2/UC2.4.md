UC.2.6. Visualizar a previsão da nota de um aluno

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar detalhes da previsão de notas de um aluno.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (precisa de compreender o desempenho previsto para adaptar as suas estratégias), alunos (beneficiam de avaliações e abordagens adequadas ao seu nível), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning (dependente do US6). O professor já está na página de visualização de notas (dependente do U2.1).

**Main Success Scenario**:  
1. O professor acede à pagina inicial;
2. Seleciona a opção "Prediction of Grades;
3. O professor seleciona o grupo que quer analisar.
4. O sistema exibe o histórico das previsões para todos os alunos;
5. O sistema apresenta estatísticas globais (Total predictions, Average Grade, Standar Deviation, Highest Predicted Grade e Lowest Predicted Grade);
6. O professor clica em "View" que aparece na coluna details da tabela com as previsões.

**Extensions**:

1a. Sem detalhes do aluno.
- 1a1. O sistema exibe uma mensagem equivalente a "De momento, não existem dados adicionais sobre este aluno."