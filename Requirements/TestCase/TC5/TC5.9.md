**Test Case ID**: TC5.9

**Test Case Description**: Verificar se o professor consegue gerar um relatório de produtividade de grupos com filtros personalizados, como período de tempo específico, métricas selecionadas e grupos específicos, e se o relatório gerado reflete corretamente os filtros aplicados.  

**Related Use Cases**: UC5.2 - Criar um relatório personalizado de produtividade dos grupos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter dados sobre a produtividade dos grupos disponíveis.  
- Devem existir grupos e dados de produtividade associados a esses grupos no sistema.  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Ver desempenho de Grupos em trabalhos".  
- Selecionar a opção "Gerar relatório personalizado".  
- Definir filtros personalizados:  
  - Selecionar um período de tempo específico (ex: "Última semana", "Trimestre atual", "Intervalo de datas personalizado").  
- Clicar no botão "Gerar Relatório".  

**Expected Result**:  

- O sistema deve gerar um relatório de produtividade de grupos.  
- O relatório deve ser apresentado ao professor no formato esperado (visual/download).  
- O relatório deve refletir os filtros personalizados aplicados:  
  - Os dados no relatório devem ser apenas para o período de tempo selecionado.  
  - O relatório deve conter apenas as métricas selecionadas pelo professor.  
  - O relatório deve incluir dados apenas para os grupos específicos selecionados.  
- Os dados no relatório devem ser precisos e corresponder aos dados filtrados no sistema.  

**Actual Result**: