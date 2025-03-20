**Test Case ID:**: TC5.1

**Test Case Description:**: Verificar se o professor consegue visualizar corretamente a lista de grupos e as métricas de produtividade dos grupos ao aceder à funcionalidade correspondente na dashboard.

**Related Use Cases**:  UC5.1 - Ver a previsão desempenho de diferentes grupos em trabalhos, Main Success Scenario, Passos 1-4.

**Pre-conditions**:

- O professor deve estar autenticado no sistema (login bem-sucedido - dependência do UC1.1).
- O sistema deve ter acesso aos dados dos alunos e previsões de produtividade (dependência do UC6.1 ou UC6.2).
- Devem existir dados de grupos e trabalhos no sistema, incluindo métricas de produtividade calculadas (dados de teste ou reais).

**Steps**:

- Aceder à dashboard do professor no sistema.
- Clicar até à opção "Ver desempenho de diferentes grupos".

**Expected Result**:

- O sistema deve exibir a página de "Desempenho de Grupos em Trabalhos".
- O professor deve ver uma lista de todos os grupos (histórico).
- Ao selecionar a opção para visualizar a produtividade dos grupos, o sistema deve exibir métricas de produtividade para cada grupo, tais como:
- Número de commits.
- Tempo médio por tarefa.
- Percentual de conclusão do trabalho.
- As métricas devem ser apresentadas de forma clara e organizada, permitindo a comparação entre grupos.

**Actual Result**: