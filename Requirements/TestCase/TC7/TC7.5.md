**Test Case ID**: TC7.5

**Test Case Description**: Verificar se o sistema impede o registo quando existem campos obrigatórios do formulário estão vazios.

**Related Use Cases**: UC7.1

**Pre-conditions**:
- O sistema de registo de professores está acessível.

- Campos obrigatórios definidos no formulário de registo (Nome, Email, Password e Verificação de password).

**Steps**:
- Aceder à página de registo de professores.

- Tentar submeter o formulário de registo sem preencher um ou mais campos obrigatórios (deixar campos em branco).

- Submeter o formulário de registo.

Expected Result:
- O sistema deve validar os campos obrigatórios.

- O sistema deve exibir mensagens de erro "Full name is required.","Email is required.","Password is required." e "Please confirm your password.".

- O registo não deve ser concluído.

**Actual Results:**

- Aprovado.