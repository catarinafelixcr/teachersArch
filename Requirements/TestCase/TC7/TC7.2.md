**Test Case ID**: TC7.2 - Registo com Email Institucional Inválido

**Test Case Description**: Verificar se o sistema impede o registo com um email institucional que não seja válido ou que não corresponda ao formato esperado.

**Related Use Cases**: UC7.1

**Pre-conditions**:

- O sistema de registo de professores está acessível.

**Steps**:

- Aceder à página de registo de professores.

- Preencher o formulário de registo, introduzindo um email que não seja um email institucional válido (teste@gmail.com).

- Submeter o formulário de registo.

**Expected Result**:

- O sistema deve validar o formato do email.

- O sistema deve exibir uma mensagem de erro "Enter a valid email address.".

- O registo não deve ser concluído.

**Actual Results:**

Aprovado.