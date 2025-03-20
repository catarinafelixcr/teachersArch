**Test Case ID**: TC5.8

**Test Case Description**: Verificar se o professor consegue gerar um relatório de produtividade de grupos com sucesso, utilizando as opções de filtro padrão (ou mínimas necessárias) e se o relatório é gerado corretamente.  

**Related Use Cases**: UC5.2 - Criar um relatório personalizado de produtividade dos grupos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter dados sobre a produtividade dos grupos disponíveis.  
- Devem existir grupos e dados de produtividade associados a esses grupos no sistema.  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Ver desempenho de Grupos em trabalhos".  
- Na página de desempenho de grupos, selecionar a opção "Gerar relatório personalizado".  
- Clicar no botão "Gerar Relatório".  

**Expected Result**:  

- O sistema deve gerar um relatório de produtividade de grupos.  
- O relatório deve ser apresentado ao professor em formato visual (gráficos, tabelas) ou para download (PDF/Excel), conforme as opções do sistema.  
- O relatório deve conter as métricas de produtividade (padrão ou mínimas selecionadas) para todos os grupos (ou o grupo padrão, se houver um grupo padrão selecionado).  
- Os dados no relatório devem ser precisos e corresponder aos dados de produtividade existentes no sistema.  

**Actual Result**: