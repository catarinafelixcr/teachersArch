UC4.3. Gerar relatório de desempenho por categorias

**Primary Actor**: Professor.

**Scope**: Gerar um relatório detalhado sobre o desempenho dos alunos em risco de reprovação, com uma opção de download em formato PDF.

**Level**: Objetivos do Usuário (Sea Level).

**Stakeholders**: Professor (necessita de um relatório consolidado para monitorizar os alunos em risco de reprovação), Aluno (beneficiam de intervenções pedagógicas personalizadas com base nos relatórios), Instituição de Ensino (nem como objetivo reduzir a taxa de reprovação e melhorar o desempenho global dos alunos)

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1 - Login). O sistema deve ter acesso às previsões de desempenho geradas pelo modelo de Machine Learning (dependente do US6).

**Main Success Scenario**:  
1. O professor acede ao painel de controlo.  
2. O professor seleciona a opção "Relatório de Alunos em Risco".  
3. O sistema exibe a lista de alunos identificados como "em risco".  
4. O professor aplica os filtros desejados (por exemplo, grupo, percentagem de risco).  
5. O professor seleciona a opção "Gerar Relatório".  
6. O sistema gera o relatório com os dados filtrados e permite o download em formato PDF.

**Extensions**:  
3a - O sistema falha ao exibir a lista de alunos em risco.  
- 3a1. O sistema exibe uma mensagem: "Erro ao carregar os dados. Tente novamente mais tarde."

6a - O sistema falha ao gerar o relatório.  
- 6a1. O sistema exibe uma mensagem: "Erro ao gerar o relatório. Verifique os filtros selecionados ou tente novamente."
