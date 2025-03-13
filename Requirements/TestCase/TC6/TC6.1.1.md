**Test case ID:** TC6.1.1

**Test Case Description:** Verificar se um professor consegue inserir um link de repositório GitLab válido, e se o sistema recolhe os dados e inicia o processamento do modelo de Machine Learning com sucesso.

**Related Use Case:** UC6.1 - Inserir Link do Repositório GitLab, Main Success Scenario.

**Pre-conditions:**

    - O professor deve estar autenticado no sistema (login bem-sucedido - dependência do UC1.1).

    - O sistema deve ter acesso à API do GitLab.

    - Deve existir um repositório GitLab válido e acessível com dados.

**Steps:**

    - Aceder à dashboard do professor no sistema.

    - Navegar até à opção "Inserir dados de GitLab".

    - Escolher a opção para inserir dados (aluno específico, grupo, ou turma - conforme o passo 2 do UC).

    - Inserir um link de repositório GitLab válido e acessível no campo apropriado.

    - Clicar no botão "Validar" ou "Inserir".

**Expected Results:**

    - O sistema deve validar o link como válido.

    - O sistema deve recolher os dados do repositório GitLab.

    - O sistema deve iniciar o processamento do modelo de Machine Learning automaticamente.

    - O sistema deve exibir a mensagem de sucesso: "Os dados foram recolhidos com sucesso e o modelo de Machine Learning está a processar as previsões. Em breve, poderá consultá-las." (ou similar).

    - Os dados do GitLab devem ser armazenados no sistema (verificar na base de dados/logs).

**Actual Results:**