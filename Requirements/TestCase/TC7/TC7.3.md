**Test Case ID**: TC7.3 - Registo com Password Fraca

**Test Case Description:** Verificar se o sistema impede o registo com uma password que não cumpra os requisitos de complexidade definidos.

**Related Use Cases**: UC7.1

**Pre-conditions**:
- O sistema de registo de professores está acessível.
- Requisitos de complexidade de password definidos no sistema (mínimo de caracteres, letras maiúsculas, minúsculas, números, símbolos).

**Steps**:
- Aceder à página de registo de professores.
- Preencher o formulário de registo, introduzindo uma password que não cumpra os requisitos de complexidade.
- Submeter o formulário de registo.

**Expected Result:**
- O sistema deve validar a complexidade da password.
- O sistema deve exibir uma mensagem de erro clara junto ao campo de password: "A password deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas e números."
- O registo não deve ser concluído.

**Actual Results:**

    - Aprovado.
