UC.2.4. Comparar a previsão em dois momentos distintos  

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para comparar a previsão atual de notas dos alunos com previsões feitas em momentos anteriores.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (quer verificar se as previsões mudaram ao longo do tempo), instituição de ensino (pode usar essas comparações para entender melhor o impacto do tempo e da atividade dos alunos na precisão das previsões) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning (dependente do US6). O sistema deve armazenar previsões anteriores feitas em diferentes momentos.

**Main Success Scenario**:  
1. O professor acede à pagina inicial;
2. Seleciona a opção "Prediction of Grades;
3. O professor seleciona o grupo que quer analisar.
4. O sistema exibe o histórico das previsões para todos os alunos;
5. O sistema apresenta estatísticas globais (Total predictions, Average Grade, Standar Deviation, Highest Predicted Grade e Lowest Predicted Grade);
6. O professor seleciona a opção "Compare over Time";
7. O sistema apresenta opções para selecionar a data da previsão da segunda data a ser comparada com a data da previsão mais recente.
8. O sistema apresenta estatísticas globais de ambas as previsões (Average Grade, Standard Deviation, Min, Max e Number of Students).
9. O sistema apresenta os intervalos das notas previstas (0-5, 5-9, 10-13, 14-17, 18-20).
10. O sistema exibe uma tabela com as previsões nos dois momento para cada aluno.
11. O sistema exibe três gráficos, que podem variar de acordo com a opção da métrica que o professor seleciona (Predicted Grade, Total Commits, Issues Created e Active Days)

Extensions:
3a. As previsões apresentam um nível de confiança baixo.
- 3a1. O sistema exibe uma mensagem "Low Confidence (<70%)"

3b. Não existe histórico de previsões.
- 3b1. O sistema exibe uma mensagem equivalente a "No grade predictions available."

5a. Não há previsões passadas disponíveis para comparação.
- 5a1. O sistema exibe uma mensagem equivalente a "No options"
