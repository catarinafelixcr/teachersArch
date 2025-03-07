Criar um relatório personalizado de produtividade dos grupos.

**Primary Actor**: Professor.

**Scope/Goal**: Criar um relatório personalizado sobre a produtividade dos grupos de alunos, para análise detalhada e feedback.

**Level**: User Goal (Sea Level).

**Stakeholders**:

- Professor: Avaliar de forma detalhada a colaboração entre os grupos e personalizar o feedback.
- Alunos: Receber feedback detalhado sobre o seu desempenho.
- Instituição de Ensino: Obter relatórios detalhados sobre o desempenho da turma e dos grupos.
- Modelo ML: Fornecer dados detalhados para gerar o relatório personalizado.


**Preconditions**:
O professor deve estar autenticado no sistema (dependente do US1).
O sistema deve ter dados sobre a produtividade dos alunos, incluindo previsões baseadas no modelo de Machine Learning.

**Main Success Scenario**:

1. O professor acede à plataforma e seleciona a turma que deseja analisar.
2. O sistema exibe uma lista com todos os grupos da turma.
3. O professor seleciona a opção para gerar um relatório personalizado.
4. O sistema apresenta opções de filtro, como:
  - Período de tempo (semana, mês, trimestre).
  - Métricas a incluir no relatório (número de commits, tempo por tarefa, percentual de conclusão, etc.).
  - Grupo(s) específico(s) ou a turma inteira.
5. O professor escolhe os filtros desejados e clica em "Gerar Relatório".
6. O sistema gera o relatório com as métricas solicitadas e o apresenta em formato visual (gráficos, tabelas) ou para download em PDF/Excel.
7. O professor pode visualizar ou compartilhar o relatório com os alunos, ou com a administração.

**Extensions**:

1a. O sistema não consegue gerar o relatório devido à falta de dados.
- 1a1. O sistema exibe a mensagem "Não há dados suficientes para gerar o relatório."
- 1a2. O professor pode optar por gerar um relatório com dados parciais ou esperar pela atualização dos dados.

2a. O professor escolhe filtros inválidos.
- 2a1. O sistema exibe uma mensagem de erro "Filtro inválido selecionado. Verifique as opções e tente novamente."
- 2a2. O professor ajusta os filtros e tenta novamente.
