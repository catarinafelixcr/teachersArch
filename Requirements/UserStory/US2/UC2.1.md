UC.2.1. Ver alunos com previsão de reprovação.


**Primary Actor**: Professor.

**Scope/Goal**: O sistema permite que os professores identifiquem quais alunos têm previsão de reprovação, de modo a facilitar uma intervenção atempada.

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor (precisa de identificar os alunos em risco), alunos (beneficiam de apoio extra, caso haja intervenção por parte do professor), instituição de ensino (quer reduzir a taxa de reprovação) e sistema de Previsão (modelo de ML).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões do modelo de Machine Learning.

**Main Success Scenario**:  
1. O professor acede à dashboard e seleciona um grupo.
2. O professor visualiza as notas de todos os alunos do grupo.
3. O professor seleciona a opção "Alunos em risco de reprovação".
4. O sistema processa os dados e exibe os alunos identificados como em risco.
5. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.


**Extensions**:

3a. O modelo de ML não retorna previsões.
- 3a1. O sistema exibe uma mensagem "Os dados de previsão não estão disponíveis de momento. Tente novamente mais tarde."

3b. O grupo não tem dados suficientes para análise.
- 3b1. O sistema exibe uma mensagem "Não há dados suficientes sobre este grupo."
    
4a. Nenhum aluno está previsto para reprovação.
- 4a1. O sistema exibe uma mensagem "Nenhum aluno em risco de reprovação."

5a. - O professor clica num aluno, mas não há detalhes disponíveis
- 5a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."
