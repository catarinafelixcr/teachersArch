**Test Case ID:** TC3.4

**Test Case Description:** Simular uma falha ao carregar as visualizações interativas na página de previsões por categorias e verificar se o sistema exibe a mensagem de erro correta.

**Related Use Cases**: UC3.1 - Visualizar a previsão de desempenho por categorias

**Pre-conditions**:

- O professor deve estar autenticado no sistema.

- (Para simular a falha): Pode ser necessário configurar o ambiente de teste para que as visualizações falhem ao carregar (por exemplo, desconectar o serviço de visualização de dados, simular um erro de rede).

**Steps**:

- O professor está na dashboard;

- O professor seleciona a opção "Performance Overview by Category".

**Expected Result**:

- O sistema deve tentar carregar a página de "Performance Overview by Category".

- O carregamento das visualizações interativas deve falhar (devido à simulação da falha).

- O sistema exibe uma mensagem de erro: "No predictions found for this group."

- As visualizações interativas não devem ser exibidas ou devem ser exibidas com erros visíveis que indiquem a falha no carregamento (gráficos vazios).

**Actual Result**:

- Aprovado.