**Test Case ID**: TC5.12  

**Test Case Description**: Verificar se o sistema lida corretamente com a situação em que não há dados suficientes para gerar o relatório (ex: nenhum dado de produtividade dentro do período de tempo selecionado, nenhum dado para os grupos selecionados) e exibe a mensagem de erro esperada.  

**Related Use Cases**: UC5.2 - Criar um relatório personalizado de produtividade dos grupos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- A página de geração de relatório personalizado deve estar acessível.  
- Não devem existir dados de produtividade no sistema que correspondam aos filtros selecionados. Configurar o ambiente de teste para que não haja dados para o período/grupos selecionados - ex: selecionar um período de tempo no futuro, selecionar grupos que não têm dados associados.  

**Steps**:  

- Aceder à página de geração de relatório personalizado.  
- Definir filtros que resultem em ausência de dados:  
  - Selecionar um período de tempo para o qual se sabe que não existem dados de produtividade.  
- Clicar no botão "Gerar Relatório".  

**Expected Result**:  

- O sistema não deve gerar o relatório.  
- O sistema deve exibir uma mensagem de erro clara e informativa para o professor, indicando que não há dados suficientes para gerar o relatório.  
- A mensagem deve ser semelhante a:  
  - "Não há dados suficientes para gerar o relatório."    
- O sistema deve manter o professor na página de geração de relatório, permitindo que ele ajuste os filtros ou entenda porque o relatório não pôde ser gerado.  

**Actual Result**: