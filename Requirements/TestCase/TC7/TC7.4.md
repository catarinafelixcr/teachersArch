**Test Case ID**: TC7.4

**Test Case Description**: Verificar se o sistema impede o registo com um email institucional que já está associado a uma conta de professor existente.

**Related Use Cases**: UC7.1

**Pre-conditions**:

- O sistema de registo de professores está acessível.

- Já existe uma conta de professor registada no sistema com o email institucional a ser utilizado para o teste.

**Steps**:

- Aceder à página de registo de professores.

- Preencher o formulário de registo com dados válidos, utilizando um email institucional que já está registado.

- Submeter o formulário de registo.

**Expected Result**:

- O sistema deve verificar se o email institucional já existe na base de dados.

- O sistema deve exibir uma mensagem de erro: "You already have an account with this email address."

- O registo não deve ser concluído.

**Actual Results:**

- Aprovado.