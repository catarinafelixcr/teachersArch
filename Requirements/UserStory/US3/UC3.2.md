UC3.2 Visualizar a previsão de desempenho por categorias para um grupo

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar a previsão de desempenho dos alunos categorizada em faixas como "Very High", "High", "Medium", "Low" e "Very Low".

**Level**: User Goals (Sea Level).

**Stakeholders**: Professor (quer compreender o desempenho geral do grupo), aluno (beneficiam de um ensino mais adequado para o seu grupo), instituição de ensino (pretende melhorar a qualidade de ensino).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6). 

**Main Success Scenario**:
1. O professor está na dashboard;
2. O professor seleciona a opção "Performance Overview by Category";
3. O sistema exibe as previsões categorizadas de todos os aluno (histórico);
4. O professor seleciona um grupo específico nos filtros;
4. O sistema exibe apenas as previsões desse grupo;
5. O professor pode aplicar filtros adicionais;
6. O sistema ajusta automaticamente a exibição.

**Extensions**:

6a - O sistema falha ao exibir as visualizações interativas.
- 6a1. O sistema sofre um erro técnico e exibe uma mensagem "Error fetching predictions:"