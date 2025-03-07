UC.2.1. Visualizar a previsão de notas dos alunos.


**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar a previsão de notas de todos os alunos.

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor (precisa compreender o desempenho previsto para adaptar as suas estratégias), alunos (beneficiam de avaliações e abordagens adequadas ao seu nível), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões do modelo de Machine Learning. 

**Main Success Scenario**:  
1. O professor acede à dashboard;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe previsões de todos os alunos;
4. O sistema apresenta estatísticas globais (média prevista, desvio padrão, percentis).
5. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.

**Extensions**:

3a. O modelo de ML não retorna previsões.
- 3a1. O sistema exibe uma mensagem "Os dados de previsão não estão disponíveis de momento."

3b. Não há dados suficientes para gerar previsões.
- 3b1. O sistema exibe uma mensagem ‘Não há dados suficientes para gerar previsões de notas de momento. Por favor insira."

3a. As previsões apresentam um nível de confiança baixo.
- 5a1. O sistema exibe uma mensagem "Previsões com baixa confiança (probabilidade < 70%)."
 
5a. Sem detalhes do aluno.
- 5a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."