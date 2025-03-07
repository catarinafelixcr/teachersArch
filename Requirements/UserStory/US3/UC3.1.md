UC3.1 Visualizar a previsão de desempenho por categorias

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para visualizar a previsão de desempenho dos alunos categorizada em faixas como "Muito bom", "Bom", "Médio", "Baixo" e "Muito baixo".

**Level**: User Goals (Sea Level).

**Stakeholders**: Professor (quer compreender o desempenho geral), aluno (beneficiam de um ensino mais adequado ao seu nível de desempenho), instituição de ensino (pretende melhorar a qualidade de ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**:  O professor deve estar autenticado no sistema. O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US2). 

**Main Success Scenario**:
1. O professor está na dashboard com a opção "Previsão das Notas" ativa;
2. O professor seleciona a opção "Previsão de Desempenho por Categorias";
3. O sistema exibe as previsões categorizadas de todos os aluno;
4. O sistema apresenta visualizações gráficas e tabelas interativas;
5. O professor aplicarfiltros iterativos ao selecionar uma categoria especifica ou um grupo;
6. O sistema atualiza automaticamente as visualizações conforme os filtros aplicados.

**Extensions**:

6a - O sistema falha ao exibir as visualizações interativas.
- 6a1. O sistema sofre um erro técnico e exibe uma mensagem "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."