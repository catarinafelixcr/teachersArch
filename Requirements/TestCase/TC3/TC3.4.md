**Test Case ID:** TC3.4

**Test Case Description:** Simular uma falha ao carregar as visualizações interativas na página de previsões por categorias e verificar se o sistema exibe a mensagem de erro correta.

**Related Use Cases**: UC3.1 - Visualizar a previsão de desempenho por categorias, Extensão 6a.

**Pre-conditions**:
- O professor deve estar autenticado no sistema.
- (Para simular a falha): Pode ser necessário configurar o ambiente de teste para que as visualizações falhem ao carregar (por exemplo, desconectar o serviço de visualização de dados, simular um erro de rede).

**Steps**:
- O professor está na dashboard;
- O professor seleciona a opção "Previsão de Desempenho por Categorias".

**Expected Result**:
- O sistema deve tentar carregar a página de "Previsão de Desempenho por Categorias".
- O carregamento das visualizações interativas deve falhar (devido à simulação da falha).
- O sistema deve exibir uma mensagem de erro: "O sistema sofreu um erro técnico ao carregar as visualizações. Tente novamente mais tarde."
- As visualizações interativas não devem ser exibidas ou devem ser exibidas com erros visíveis que indiquem a falha no carregamento (gráficos vazios, etc.).

**Actual Result**: