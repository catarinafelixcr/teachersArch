UC3.1 Visualizar a previsão de desempenho por categorias

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar a previsão de desempenho dos alunos categorizada em faixas como "Very High", "High", "Medium", "Low" e "Very Low".

**Level**: User Goals (Sea Level).

**Stakeholders**: Professor (quer compreender o desempenho geral), aluno (beneficiam de um ensino mais adequado ao seu nível de desempenho), instituição de ensino (pretende melhorar a qualidade de ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema. O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US1 e US6). 

**Main Success Scenario**:
1. O professor está na dashboard;
2. O professor seleciona a opção "Performance Overview by Category";
3. O professor seleciona o grupo;
4. O sistema exibe as previsões categorizadas de todos os alunos do grupo (histórico);
5. O sistema apresenta visualizações gráficas e tabelas interativas (Category Overview, Individual Scores (%), Metric Correlation (Total Commits vs Active Days));
6. O professor aplica filtros iterativos ao selecionar uma categoria especifica;
7. O sistema atualiza automaticamente as visualizações conforme os filtros aplicados.

**Extensions**:

6a - O sistema falha ao exibir as visualizações interativas.
- 6a1. O sistema sofre um erro técnico e exibe uma mensagem **sem mensagem pre definida**