UC5.2. Criar um relatório personalizado de produtividade dos grupos.

**Primary Actor**: Professor.

**Scope**: Criar um relatório personalizado sobre a produtividade dos grupos de alunos, para análise detalhada e feedback.

**Level**: User Goal (Sea Level).

**Stakeholders**: Professor (pretende avaliar de forma detalhada a colaboração entre os grupos), alunos (mostrar o seu desempenho), instituição de ensino (procuram melhorar a qualidade do ensino).

**Preconditions**:
O professor deve estar autenticado no sistema (dependente do US1).
O sistema deve ter dados sobre a produtividade dos alunos, incluindo previsões baseadas no modelo de Machine Learning (depende do US6).

**Main Success Scenario**:

1. O professor entra na dashboard;
2. Seleciona a opção "Ver desempenho de diferentes grupos em trabalhos";
3. O professor vê uma lista com todos os grupos (historico);
4. O professor seleciona a opção para gerar um relatório personalizado;
4. O sistema apresenta opções de filtro, como:
  - Período de tempo (semana, mês, trimestre);
  - Métricas a incluir no relatório (número de commits, tempo por tarefa, percentual de conclusão, etc.);
  - Grupo(s) específico(s) ou todos;
5. O professor escolhe os filtros desejados e clica em "Gerar Relatório".
6. O sistema gera o relatório com as métricas solicitadas e o apresenta em formato visual (gráficos, tabelas) ou para download em PDF/Excel.
7. O professor pode visualizar ou compartilhar o relatório com os alunos, ou com a administração.

**Extensions**:

5a. O professor escolhe filtros inválidos.
- 5a1. O sistema exibe uma mensagem de erro "Filtro inválido selecionado. Verifique as opções e tente novamente."
- 5a2. O professor ajusta os filtros e tenta novamente.

6a. O sistema não consegue gerar o relatório devido à falta de dados.
- 6a1. O sistema exibe a mensagem "Não há dados suficientes para gerar o relatório."
- 6a2. O professor pode optar por gerar um relatório com dados parciais ou esperar pela atualização dos dados.