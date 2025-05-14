**Test Case ID**: TC7.1

**Test Case Description**: Verificar se um professor consegue registar-se com sucesso no sistema utilizando dados válidos.

**Related Use Cases**: UC7.1

**Pre-conditions**:

- O sistema de registo de professores está acessível.

- Não existe uma conta de professor registada com o email institucional a ser utilizado para o teste.

**Steps**:

- Aceder à página de registo de professores.

- Preencher o formulário de registo com dados válidos para todos os campos obrigatórios (nome, email institucional, password, verificar password).

- Submeter o formulário de registo.

**Expected Result**:

- O sistema deve validar os dados introduzidos sem erros.

- O sistema deve criar uma nova conta de professor na base de dados.

- O sistema deve exibir uma mensagem de sucesso de registo: "Account created successfuly! Please check your email to verify your account before logging in."

**Actual Results:**

Aprovado.
