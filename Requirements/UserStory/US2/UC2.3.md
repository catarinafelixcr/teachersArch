UC2.5. Criar um relatório de notas dos grupos.

**Primary Actor**: Professor.

**Scope**: Criar um relatório com as notas dos grupos dos alunos, baseado nas previsões de notas e estatísticas extraídas do modelo de Machine Learning, permitindo o download em formato PDF.

**Level**: User Goal (Sea Level).

**Stakeholders**: Professor (precisa de compreender o desempenho previsto para adaptar as suas estratégias), alunos (beneficiam de avaliações e abordagens adequadas ao seu nível), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning (dependente do US6). Os alunos devem estar corretamente associados a grupos.

**Main Success Scenario**:

1. O professor acede à dashboard;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe as previsões para todos os alunos;
4. O sistema apresenta estatísticas globais (média prevista, desvio padrão, percentis);
5. O professor seleciona a opção "Gerar relatório";
6. O sistema gera o relatório em formato PDF;
7. O professor faz o download do relatório.

**Extensions**:

5a. As previsões apresentam um nível de confiança baixo.
- 5a1. O sistema exibe uma mensagem de alerta: "As previsões possuem baixa confiança (probabilidade < 70%). O relatório pode não refletir o desempenho real."

7a. Falha ao gerar o relatório.
- 7a1. O sistema exibe uma mensagem de erro e sugere tentar novamente.