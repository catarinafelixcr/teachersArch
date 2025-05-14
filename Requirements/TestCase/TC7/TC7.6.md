**Test Case ID**: TC7.6 

**Test Case Description:** Verificar o comportamento do sistema quando ocorre uma falha inesperada durante o processo de criação da conta na base de dados.

**Related Use Cases**: UC7.1

**Pre-conditions**:

- O sistema de registo de professores está acessível.

- Simular uma condição que cause falha na criação da conta (e.g., indisponibilidade da base de dados, erro interno do sistema).

**Steps**:

- Aceder à página de registo de professores.

- Preencher o formulário de registo com dados válidos.

- Submeter o formulário de registo.

**Expected Result**:

- O sistema não deve conseguir criar a conta na base de dados devido à falha simulada.

- O sistema deve exibir uma mensagem de erro: "An unexpected error occurred during registration. Please try again later."

- O registo não deve ser concluído.

**Actual Results:**

- Aprovado.