**Test case ID:** TC1.2

**Test case description:**  Verificar se o sistema impede o login com um email incorreto e exibe a mensagem de erro adequada.

**Related Use Cases:** UC1.1 - Login com email e password, Extensão 3a.

**Pre-conditions:**

    - O sistema deve estar operacional.

    - A base de dados deve estar acessível.

**Steps:**

    - Aceder à página de login do sistema.

    - Introduzir um email não registado no campo "Email".

    - Introduzir uma password qualquer no campo "Password".

    - Clicar no botão "Login".

**Expected Results:**

    - O sistema não deve autenticar o login.

    - O sistema deve permanecer na página de login.

    - O sistema deve exibir uma mensagem de erro equivalente a: "Email ou password incorretos." (ou similar).

**Actual Result:**

    - Aprovado.