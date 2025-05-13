UC.6.1. Inserir Link do Repositório GitLab

**Primary Actor**: Professor.

**Scope**: O professor fornece um link do repositório GitLab ao sistema, permitindo a recolha dos dados de atividade dos alunos e inicia o processamento do modelo de Machine Learning.

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor (garante que o sistema tem acesso aos repositórios certos), alunos (beneficiam de previsões baseadas nos dados do GitLab), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (depende destes dados para gerar previsões precisas).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso à API do GitLab para validação do link.

**Main Success Scenario**:
1. O professor acede à dashboard;
2. Seleciona a opção "Insert Repository";
3. O professor insere o link do repositório GitLab;
4. O sistema recolhe os dados do GitLab e armazena-os para processamento;
5. O sistema inicia automaticamente o processamento do modelo de Machine Learning;
6. O professor recebe uma mensagem " "

**Extensions**:

3a - O link fornecido não é válido
- 3a1. O sistema exibe a mensagem: "Repository link must be a valid GitLab URL."

6a - O processamento do modelo de ML falha
- 6a1. O sistema exibe uma mensagem: " "
