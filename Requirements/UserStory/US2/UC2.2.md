UC.2.2. Visualizar a previsão de notas dos alunos de um grupo

**Primary Actor**: Professor.

**Scope/Goal**: O professor acede ao sistema para visualizar a previsão de notas dos alunos de um grupo específico.

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor  (precisa compreender o desempenho previsto de um grupo especifico para adaptar as suas estratégias), alunos  (beneficiam de avaliações  mais personalizadas dentro do grupo), instituição de ensino (procuram melhorar a qualidade do ensino) e sistema de Previsão (fornece previsões de desempenho com base na atividade dos alunos.).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões do modelo de Machine Learning. Os alunos devem estar corretamente associados a um grupo.

**Main Success Scenario**:  
1. O professor acede à dashboard;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe previsões de todos os alunos;
4. O professor seleciona um grupo.
5. O sistema filtra e exibe as previsões de notas dos alunos do grupo.
6. O sistema apresenta estatísticas do grupo (média prevista, desvio padrão, percentis) e comparação com os restantes grupos.
7. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.

**Extensions**:

3a. O modelo de ML não retorna previsões.
- 3a1. O sistema exibe uma mensagem "Os dados de previsão não estão disponíveis de momento. Tente novamente mais tarde."

3b. Não há dados suficientes para gerar previsões.
- 3b1. O sistema exibe uma mensagem ‘Não há dados suficientes para gerar previsões de notas de momento."
    
4b O grupo não tem alunos com previsões disponíveis.
- 4b1. O sistema exibe uma mensagem "Não há previsões de notas disponíveis para este grupo."

5a. As previsões apresentam um nível de confiança baixo.
- 5a1. O sistema exibe uma mensagem "Previsões com baixa confiança (probabilidade < 70%)."

7a. Sem detalhes do aluno.
- 7a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."