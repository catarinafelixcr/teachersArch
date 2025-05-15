**Test Case ID:** TC3.10

**Test Case Description:** Verificar o comportamento do sistema quando não existem previsões de desempenho disponíveis para apresentar (ex: antes de executar o UC6.1 ou UC6.2 pela primeira vez, ou se não houver dados de GitLab para processar).

**Related Use Cases:** UC3.1 - Visualizar a previsão de desempenho por categorias.

**Pre-conditions**:
- O professor deve estar autenticado no sistema.
- Não devem existir previsões de desempenho geradas no sistema. (Garantir que o sistema está num estado inicial ou que as previsões foram apagadas para este teste).

**Steps**:
- Aceder à dashboard do professor no sistema.
- Clicar na opção "Performance Overview by Category".

**Expected Result**:
- O sistema deve exibir a página de "Performance Overview by Category".
- Em vez das visualizações de dados, o sistema deve apresentar uma mensagem informativa "Nenhuma previsão encontrada para este grupo".
- A página não deve apresentar erros ou visualizações vazias que possam confundir o utilizador.

**Actual Result**: