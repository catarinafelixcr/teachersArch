**Test case ID:** TC6.2

**Test Case Description:** Verificar se o sistema rejeita um link GitLab com formato inválido (ex: URL mal formada) e exibe a mensagem de erro adequada.

**Related Use Case:** UC6.1 - Inserir Link do Repositório GitLab

**Pre-conditions:**

    - O professor deve estar autenticado no sistema.
    - O sistema deve ter acesso à API do GitLab.

**Steps:**

    - Aceder à dashboard do professor no sistema.
    - Navegar até à opção "Insert Repository".
    - Escolher a opção para inserir dados (aluno específico, grupo, ou turma).
    - Inserir um link de repositório GitLab com formato inválido (ex: "texto aleatório", "http://google.com", "gitlab.com/user/repo").
    - Clicar no botão "Submit GitLab Link".

**Expected Results:**

    - O sistema não deve validar o link.
    - O sistema deve exibir a mensagem de erro: "Repository link must be a valid GitLab URL.".
    - O sistema não deve tentar recolher dados nem iniciar o processamento de ML.

**Actual Results:**