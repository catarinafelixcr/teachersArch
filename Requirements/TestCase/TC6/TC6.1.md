**Test Case ID**: TC6.1

**Test Case Description**: Verificar se um professor consegue atualizar os dados do GitLab com um link válido, quando existem novas atividades desde a última atualização, e se o sistema recolhe os novos dados e reinicia o processamento do modelo de Machine Learning com sucesso.  

**Related Use Cases**: UC6.2 - Atualizar Dados do GitLab, Main Success Scenario.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- O sistema deve ter acesso à API do GitLab.  
- Deve existir um repositório GitLab válido e acessível que já foi previamente associado a um aluno/grupo/turma no sistema.  
- Deve haver novas atividades no repositório GitLab desde a última vez que os dados foram recolhidos (simular novas commits, issues, etc. no GitLab).  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Atualizar dados do GitLab".  
- Inserir o link do repositório GitLab válido e já associado no campo apropriado.  
- Clicar no botão "Atualizar" ou "Validar".  

**Expected Result**:  

- O sistema deve validar o link como válido e associá-lo corretamente ao aluno/grupo/turma existente.  
- O sistema deve recolher apenas as novas atividades do repositório GitLab desde a última atualização.  
- O sistema deve reiniciar o processamento do modelo de Machine Learning automaticamente.  
- O sistema deve exibir a mensagem de sucesso:  
  - "Os dados do repositório foram atualizados com sucesso e o modelo de Machine Learning está a processar as novas previsões. Em breve, poderá consultá-las.".

**Actual Result**: 