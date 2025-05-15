**Test Case ID:** TC3.12

**Test Case Description:**  Verificar o comportamento do sistema ao tentar visualizar dados históricos de desempenho por categorias para uma data para a qual não existem dados históricos disponíveis.

**Related Use Cases:** UC3.1 - Visualizar a previsão de desempenho por categorias.

**Pre-conditions**:
- O professor deve estar autenticado no sistema.
- O sistema deve ter a funcionalidade de visualização de previsões por categorias.
- Não devem existir dados históricos de previsões de desempenho no sistema para a data que será selecionada no teste. 
- Deve existir um mecanismo para selecionar uma data a ser visualizada (filtro de data)

**Steps**:
- Aceder à dashboard do professor no sistema.
- Clicar na opção "Students' Grade Predictions".
- Clicar na opção "Compare Over Time".
- Utilizar o filtro de datas para selecionar as datas.
- Selecionar uma data específica para a qual se sabe que não existem dados históricos de previsões de desempenho. 

**Expected Result**:
- O sistema deve exibir a página "Students' Grade Predictions".
- Em vez de exibir visualizações de dados históricos para a data selecionada, o sistema deve apresentar uma mensagem informativa "No predictions to preview.".
- A página não deve exibir erros técnicos, visualizações vazias ou dados incorretos.
- O sistema mantém a estrutura da página (títulos, filtros, etc.), mas substituir a área de visualização de dados pela mensagem informativa.

**Actual Result**:

- Aprovado.