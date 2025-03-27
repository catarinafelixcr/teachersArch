**Test Case ID:** TC3.3

**Test Case Description:**  Verificar se o professor consegue aplicar filtros para visualizar previsões apenas para uma categoria específica ("Muito Bom","Bom","Médio","Baixo","Muito Baizx4xo") e se o sistema atualiza as visualizações corretamente após a aplicação do filtro.

**Related Use Cases**:  UC3.1 - Visualizar a previsão de desempenho por categorias, Main Success Scenario, Passos 5-6.

**Pre-conditions**:
- TC3.1 deve ter sido bem-sucedido e a página de previsões por categorias deve estar acessível com as visualizações exibidas.
- Deve existir a funcionalidade de filtro por categoria na página de previsões.

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Previsão de Desempenho por Categorias".
- O sistema exibe as previsões categorizadas de todos os alunos (histórico).
- Localizar e utilizar o mecanismo de filtro por categoria.
- Selecionar uma categoria específica para filtrar.
- Verificar se as visualizações são atualizadas automaticamente após a seleção do filtro.
- Repetir os passos 3 e 4 para outras categorias.

**Expected Result**:
- Após selecionar uma categoria no filtro, o sistema deve atualizar as visualizações para exibir apenas os dados correspondentes à categoria selecionada.
- A lista de alunos, gráficos e tabelas devem refletir apenas a categoria filtrada.
- As visualizações devem ser atualizadas automaticamente após a aplicação do filtro.
- Ao remover o filtro, as visualizações devem voltar a apresentar todos os dados.

**Actual Result**: