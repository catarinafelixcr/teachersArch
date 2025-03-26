**Test Case ID**: TC6.5  

**Test Case Description**: Simular uma falha no processamento do modelo de Machine Learning após a atualização dos dados do GitLab e verificar se o sistema exibe a mensagem de erro correta.  

**Related Use Cases**: UC6.2 - Atualizar Dados do GitLab. 

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso à API do GitLab.  
- Um link GitLab válido deve ter sido inserido e os dados atualizados com sucesso. 
- (Para simular a falha): Pode ser necessário configurar o ambiente de teste para que o modelo de ML falhe intencionalmente. 

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Iniciar o processo que dispara o processamento do modelo de ML após a atualização.

**Expected Result**:  

- O sistema deve recolher os novos dados do GitLab.  
- O sistema deve falhar ao processar o modelo de Machine Learning.  
- O sistema deve exibir a mensagem de erro:  
  - "Os dados foram recolhidos, mas ocorreu um erro ao gerar as previsões. Tente novamente mais tarde".  

**Actual Result**: