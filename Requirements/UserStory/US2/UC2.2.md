UC2.2. Visualizar a previsão de notas dos alunos de um grupo

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar as previsões de notas dos alunos de um grupo específico, já geradas pelo modelo de Machine Learning.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (precisa compreender o desempenho previsto de um grupo especifico para adaptar as suas estratégias), alunos (beneficiam de avaliações  mais personalizadas dentro do grupo), instituição de ensino (procuram melhorar a qualidade do ensino) e sistema de Previsão (fornece previsões de desempenho com base na atividade dos alunos.).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning. Os alunos devem estar corretamente associados a um grupo (dependente do US6).

**Main Success Scenario**:  
1. O professor acede à pagina inicial;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe o histórico das previsões para todos os alunos;
4. O professor seleciona um grupo.
5. O sistema filtra e exibe as previsões de notas dos alunos do grupo.
6. O sistema apresenta estatísticas do grupo (Predicted Grade, etc);
7. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.

**Extensions**:

3a. As previsões apresentam um nível de confiança baixo.
- 3a1. O sistema exibe uma mensagem "Previsões com baixa confiança (Low Confidence < 70%)."

3b. Não existe histórico de previsões.
- 3b1. O sistema exibe uma mensagem equivalente a"Não existem previsões disponíveis."
 
7a. Sem detalhes do aluno.
- 7a1. O sistema exibe uma mensagem equivalente a "De momento, não existem dados adicionais sobre este aluno."
