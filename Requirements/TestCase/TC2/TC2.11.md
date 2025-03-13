**Test Case ID**: TC2.11

**Test Case Description**: Verificar o comportamento do sistema quando não existem previsões passadas disponíveis para a data selecionada.

**Related Use Cases**: UC2.4

**Pre-conditions**:
- O professor deve estar autenticado.
- Os dados dos alunos e as previsões atuais devem estar disponíveis.
- Não existem previsões armazenadas para a data selecionada.

**Steps**:
- Aceder à dashboard do sistema.
- Clicar na opção "Previsão de Notas".
- Clicar na opção "Comparar Previsões".
- Selecionar uma data para a qual não existem previsões passadas.

**Expected Result:**
- O sistema deve exibir uma mensagem: "Não existem previsões registadas para a data selecionada."

**Actual Result**: 