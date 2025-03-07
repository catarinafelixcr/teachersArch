UC3.2 Gerar relatório de desempenho por categorias

**Primary Actor**: Professor.

**Scope**: Criar um relatório com as previsões de desempenho categorizadas, permitindo o download em formato PDF.

**Level**: User Goals (Sea Level).

**Stakeholders**: Professor (necessita de um documento para análise) e instituição de ensino (pretende melhorar a qualidade de ensino).

**Preconditions**: O professor deve estar autenticado no sistema (Dependente do US1). O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6). 

**Main Success Scenario**:
1. O professor está na dashboard;
2. O professor seleciona a opção "Previsão de Desempenho por Categorias";
3. O sistema exibe as previsões categorizadas de todos os aluno (histórico);
4. O professor seleciona os filtros que desejar;
5. O professor escolhe a opção "Gerar Relatório";
6. O sistema gera o relatório com filtros que tinham sido selecionados em formato PDF.

**Extensions**:

3a - O sistema falha ao exibir as visualizações interativas.
- 3a1. O sistema sofre um erro técnico e exibe uma mensagem "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."

6b - O sistema falha ao gerar o relatório.
- 6b1. O sistema exibe uma mensagem "Erro ao gerar o relatório. Tente novamente."