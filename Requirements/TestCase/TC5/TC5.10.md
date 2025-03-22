**Test Case ID**: TC5.10

**Test Case Description**: Simular uma falha de conexão com a base de dados durante o processo de geração do relatório e verificar se o sistema lida com a falha de forma adequada, exibindo uma mensagem de erro amigável em vez de falhar silenciosamente ou exibir erros técnicos.  

**Related Use Cases**: UC5.2 - Criar um relatório personalizado de produtividade dos grupos, Cenário de Falha.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- A página de geração de relatório personalizado deve estar acessível.  
- (Para simular a falha): Interromper ou simular a perda de conexão com a base de dados antes de iniciar a geração do relatório. Isso pode ser feito desconectando a aplicação da base de dados, simulando um erro de rede, ou utilizando ferramentas de teste para simular falhas de conexão.  

**Steps**:  

1. Simular a falha de conexão com a base de dados.  
2. Aceder à página de geração de relatório personalizado.  
3. Selecionar opções de filtro padrão ou personalizadas.  
4. Clicar no botão "Gerar Relatório".  

**Expected Result**:  

- O sistema não deve conseguir gerar o relatório devido à falha de conexão com a base de dados.  
- O sistema deve exibir uma mensagem de erro clara e informativa para o professor, indicando que ocorreu um problema ao aceder aos dados devido a um problema de conexão com a base de dados.  
- A mensagem pode ser algo como:  
  - "Ocorreu um erro ao aceder aos dados para gerar o relatório. Por favor, tente novamente mais tarde."  
- O sistema não deve exibir mensagens de erro técnicas complexas, stack traces, ou falhar silenciosamente sem qualquer feedback para o utilizador.  

**Actual Result**: