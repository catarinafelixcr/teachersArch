**Test Case ID:** TC3.10

**Test Case Description:** Verificar o comportamento do sistema quando não existem previsões de desempenho disponíveis para apresentar (ex: antes de executar o UC6.1 ou UC6.2 pela primeira vez, ou se não houver dados de GitLab para processar).

**Related Use Cases:** UC3.1 - Visualizar a previsão de desempenho por categorias.

**Pre-conditions**:
- O professor deve estar autenticado no sistema.
- Não devem existir previsões de desempenho geradas no sistema. (Garantir que o sistema está num estado inicial ou que as previsões foram apagadas para este teste).

**Steps**:
- Aceder à dashboard do professor no sistema.
- Clicar na opção "Previsão de Desempenho por Categorias".

**Expected Result**:
- O sistema deve exibir a página de "Previsão de Desempenho por Categorias".
- Em vez das visualizações de dados, o sistema deve apresentar uma mensagem informativa "Não existem previsões de desempenho disponíveis neste momento." (ex: "Nenhuma previsão de desempenho gerada ainda. Por favor, insira os dados do GitLab primeiro." ou "Sem dados para exibir.").
- A página não deve apresentar erros ou visualizações vazias que possam confundir o utilizador.

**Actual Result**: