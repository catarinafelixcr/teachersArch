**Test Case ID:** TC3.2

**Test Case Description:**  Verificar se as visualizações gráficas e tabelas apresentadas na página de previsões por categorias são interativas e permitem a exploração dos dados.

**Related Use Cases**: UC3.1 - Visualizar a previsão de desempenho por categorias, Main Success Scenario, Passo 4

**Pre-conditions**:
- O Test Case 1 (TC3.1) deve ter sido bem-sucedido e a página de previsões por categorias deve estar acessível com as visualizações exibidas.

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Previsão de Desempenho por Categorias".
- Interagir com as visualizações gráficas e tabelas apresentadas:
    - Passar o cursor sobre os elementos dos gráficos (barras, pie charts, etc.).
    - Clicar em elementos das tabelas (linhas, colunas, células).
- Verificar se existem informações adicionais ao interagir com os elementos.

**Expected Result**:
- As visualizações gráficas e tabelas devem ser interativas.
- Ao passar o cursor sobre elementos dos gráficos, devem ser exibidas informações relevantes sobre o elemento (ex: nome do aluno, categoria)
- Ao clicar em elementos das tabelas, alguma ação deve ocorrer (ex: ordenação da tabela, filtro, detalhes do aluno, etc - dependendo da funcionalidade implementada).
- Não devem ocorrer erros ou comportamentos inesperados durante a interação.

**Actual Result**: