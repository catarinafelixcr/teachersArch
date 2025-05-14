**Test case ID:** TC1.3

**Test case description:** Verificar se o sistema impede o login com uma password incorreta para um email registado e exibe a mensagem de erro adequada.

**Related Use Cases:** UC1.1 - Login com email e password, Extensão 3a.

**Pre-conditions:**

    - O professor deve ter uma conta registada no sistema.

    - O professor deve conhecer o seu email correto.

    - O sistema deve estar operacional.

    - A base de dados deve estar acessível.

**Steps:**

    - Aceder à página de login do sistema.

    - Introduzir o email de um professor registado no campo "Email".

    - Introduzir uma password incorreta no campo "Password".

    - Clicar no botão "Login".

**Expected Results:**

    - O sistema não deve autenticar o login.

    - O sistema deve permanecer na página de login.

    - O sistema deve exibir uma mensagem de erro equivalente a: "Credenciais inválidas ou token ausente".

**Actual Results:**

    - Aprovado.