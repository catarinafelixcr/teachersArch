UC3.2 Gerar relatório de desempenho por categorias

**Primary Actor**: Professor.

**Scope**: Criar um relatório com as previsões de desempenho categorizadas, permitindo o download em formato PDF.

**Level**: User Goals (Sea Level).

**Stakeholders**: Professor (necessita de um documento para análise) e instituição de ensino (pretende melhorar a qualidade de ensino).

**Preconditions**: O professor deve estar autenticado no sistema (Dependente do US1). O sistema deve ter acesso às previsões geradas pelo modelo de Machine Learning (dependente do US6). 

**Main Success Scenario**:
1. O professor está na dashboard;
2. O professor seleciona a opção "Prediction of Grades";
3. O professor seleciona o grupo;
4. O sistema exibe o histórico de notas dos alunos do grupo;
5. O professor escolhe a opção "Generate Report";
6. O sistema gera o relatório em formato PDF.

**Extensions**:

3a - O sistema falha ao exibir as visualizações interativas.
- 3a1. O sistema sofre um erro técnico e exibe uma mensagem "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."

6b - O sistema falha ao gerar o relatório.
- 6b1. O sistema exibe uma mensagem "Erro ao gerar o relatório. Tente novamente."
