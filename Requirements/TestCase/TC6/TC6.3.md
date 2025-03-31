**Test Case ID**: TC6.3  

**Test Case Description**: Verificar se o sistema rejeita a atualização com um link GitLab para um repositório inexistente ou inacessível (ex: repositório privado sem permissões, repositório que não existe) e exibe a mensagem de erro adequada.  

**Related Use Cases**: UC6.2 - Atualizar Dados do GitLab. 

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso à API do GitLab.  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Atualizar dados do GitLab".  
- Inserir um link de repositório GitLab válido em formato, mas inexistente ou inacessível.
- Clicar no botão "Atualizar" ou "Validar".  

**Expected Result**:  

- O sistema não deve validar o link.  
- O sistema deve exibir uma mensagem de erro: "O link do repositório GitLab não é válido ou está inacessível".  
- O sistema não deve tentar recolher dados nem reiniciar o processamento de ML.  

**Actual Result**: