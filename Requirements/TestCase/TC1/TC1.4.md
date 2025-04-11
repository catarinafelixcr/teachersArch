**Test case ID:** TC1.4

**Test case description:** Verificar se a conta de um professor é bloqueada temporariamente após 5 tentativas consecutivas de login falhadas.

**Related Use Cases** UC1.1 - Login com email e password, Extensão 3a5, 3a6.

**Pre-conditions:**

    - O professor deve ter uma conta registada no sistema.

    - O professor deve conhecer o seu email correto.

    - O sistema deve estar operacional.

    - A base de dados deve estar acessível.

    - O sistema deve ter o mecanismo de bloqueio de conta implementado.

**Steps:**

    - Aceder à página de login do sistema.

    - Introduzir o email de um professor registado no campo "Email".

    - Introduzir uma password incorreta no campo "Password".

    - Clicar no botão "Login". (Repetir os passos 3 e 4 mais 4 vezes - totalizando 5 tentativas falhadas).

    - Após a 5ª tentativa falhada, tentar fazer login novamente com as credenciais corretas.

**Expected Results:**

    - Após as 5 tentativas falhadas, o sistema não deve permitir o login, mesmo com as credenciais corretas.

    - O sistema deve exibir uma mensagem de erro equivalente a: "Muitas tentativas falhadas. Tente novamente em 15 minutos ou redefina a password.".

**Actual Results:**

    - Aprovado.