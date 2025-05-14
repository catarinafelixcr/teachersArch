**Test case ID:** TC1.5

**Test case description:**Verificar se o link "Forgot Password" está funcional, redireciona para a página de recuperação, permite inserir email, e inicia corretamente o processo de redefinição de password com envio de email.

**Related Use Cases:** UC1.1 - Login com email e password, Extensão 3a3.

**Pre-conditions:**

    - O sistema deve estar operacional.

    - A conta do utilizador (professor) deve existir na base de dados.

    - A página de login deve conter o link "Forgot Password".

    - O servidor SMTP deve estar configurado corretamente.



**Steps:**

    - Aceder à página de login do sistema.

    - Clicar no link "Forgot Password".

    - Introduzir um email válido de um professor registado.

    - Submeter o pedido de redefinição.


**Expected Results:**

    - O professor é redirecionado para a página onde pode introduzir o email.
    - Ao submeter o email, o sistema exibe uma mensagem do tipo: "If this email exists, password reset instructions have been sent.".
    - O email é enviado com um link de redefinição que contém o ID e o token do utilizador.
    -  link enviado é funcional e leva à página correta de nova password 


**Actual Results:** 

- Aprovado