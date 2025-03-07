UC.2.1. Visualizar a previsão de notas dos alunos.


**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar a previsão de notas de todos os alunos consultadas até ao dia.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (precisa de compreender o desempenho previsto para adaptar as suas estratégias), alunos (beneficiam de avaliações e abordagens adequadas ao seu nível), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já processadas pelo modelo de Machine Learning (dependente do US6). 

**Main Success Scenario**:  
1. O professor acede à dashboard;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe o histórico das previsões para todos os alunos;
4. O sistema apresenta estatísticas globais (média prevista, desvio padrão, percentis);
5. O professor clica num aluno para obter mais detalhes sobre a respetiva previsão.

**Extensions**:

3a. As previsões apresentam um nível de confiança baixo.
- 3a1. O sistema exibe uma mensagem "Previsões com baixa confiança (probabilidade < 70%)."

3b. Não existe histórico de previsões.
- 3b1. O sistema exibe uma mensagem "Não existem previsões disponíveis."
 
5a. Sem detalhes do aluno.
- 5a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."