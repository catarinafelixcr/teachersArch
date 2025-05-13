**Test Case ID**: TC6.4  

**Test Case Description**: Verificar se o sistema identifica corretamente que não há novos dados desde a última atualização e exibe a mensagem informativa correspondente.  

**Related Use Cases**: UC6.2 - Atualizar Dados do GitLab.

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso à API do GitLab.  
- Deve existir um repositório GitLab válido e acessível que já foi previamente associado a um aluno/grupo no sistema.  
- Não deve haver novas atividades no repositório GitLab desde a última vez que os dados foram recolhidos.  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Clicar na opção "Insert Repository".  
- Inserir o link do repositório GitLab válido e já associado no campo apropriado.  
- Clicar no botão "Submit Gitlab Link".  

**Expected Result**:  

- O sistema deve validar o link e associá-lo corretamente.  
- O sistema deve verificar que não há novas atividades desde a última atualização.  
- O sistema deve exibir a mensagem informativa: "Os dados já estão atualizados. Não há novas atividades desde a última sincronização.".  
- O sistema não deve reiniciar o processamento do modelo de Machine Learning.

**Actual Result**: