**Test Case ID**: TC5.11

**Test Case Description**: Verificar se o sistema lida corretamente com a seleção de um período de tempo inválido no filtro (ex: formato de data incorreto, data de início posterior à data de fim) e exibe a mensagem de erro esperada.  

**Related Use Cases**: UC5.2 - Criar um relatório personalizado de produtividade dos grupos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- A página de geração de relatório personalizado deve estar acessível.  
- O filtro de "Período de Tempo" deve permitir a inserção manual de datas ou ter opções que possam ser configuradas de forma inválida.  

**Steps**:  

- Aceder à página de geração de relatório personalizado.  
- No filtro de "Período de Tempo", inserir um período de tempo inválido:  
  - **Exemplo 1**: Inserir uma data de início posterior à data de fim.  
  - **Exemplo 2**: Inserir uma data com formato incorreto (se a entrada manual for permitida).  
  - **Exemplo 3**: Selecionar um intervalo de tempo que não seja suportado pelo sistema (se houver restrições).  
- Clicar no botão "Gerar Relatório".  

**Expected Result**:  

- O sistema não deve gerar o relatório.  
- O sistema deve exibir uma mensagem de erro clara e informativa para o professor, indicando que o filtro de período de tempo é inválido.  
- A mensagem deve ser semelhante a:  
  - "Filtro inválido selecionado. Verifique as opções e tente novamente."    
- O sistema deve manter o professor na página de geração de relatório, permitindo que ele corrija o filtro inválido.  

**Actual Result**: