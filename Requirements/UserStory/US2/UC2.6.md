UC.2.6. Visualizar a previsão da nota de um aluno

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar detalhes da previsão de notas de um aluno.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (precisa de compreender o desempenho previsto para adaptar as suas estratégias), alunos (beneficiam de avaliações e abordagens adequadas ao seu nível), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning (dependente do US6). O professor já está na página de visualização de notas (dependente do U2.1).

**Main Success Scenario**:  
1. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.

**Extensions**:

1a. Sem detalhes do aluno.
- 1a1. O sistema exibe uma mensagem equivalente a "De momento, não existem dados adicionais sobre este aluno."