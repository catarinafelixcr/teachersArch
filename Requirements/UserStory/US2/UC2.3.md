UC2.3. Comparar a previsão de notas entre grupos

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para comparar previsões de notas entre diferentes grupos de alunos

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor (precisa de analisar e comparar o desempenho previsto dos grupos), alunos (beneficiam de avaliações  mais personalizadas dentro do grupo), instituição de ensino (procuram melhorar a qualidade do ensino) e sistema de Previsão (fornece previsões de desempenho com base na atividade dos alunos.).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning. Os alunos devem estar corretamente associados a um grupo.

**Main Success Scenario**:  
1. O professor acede à pagina inicial;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe o histórico das previsões para todos os alunos;
4. O professor seleciona a opção "Comparar notas de grupos";
5. O sistema exibe a lista de grupos disponíveis;
6. O professor seleciona dois ou mais grupos para comparar;
7. O sistema exibe as estatísticas comparativas dos grupos, como a média prevista das notas por grupo, desvio padrão e variação entre as previsões dos grupos e a distribuição gráfica das previsões de notas.

**Extensions**:

3a. As previsões apresentam um nível de confiança baixo.
- 3a1. O sistema exibe uma mensagem "Previsões com baixa confiança (probabilidade < 70%)."

3b. Não existe histórico de previsões.
- 3b1. O sistema exibe uma mensagem "Não existem previsões disponíveis."
 
4a. Não há grupos disponíveis para comparação.
- 4a1. O sistema exibe uma mensagem: "Nenhum grupo disponível para comparação. Verifique se há alunos corretamente associados a grupos."

7a. Sem detalhes do aluno.
- 7a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."