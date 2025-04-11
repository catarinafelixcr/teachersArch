**Test Case ID**: TC2.11

**Test Case Description**: Verificar o comportamento do sistema quando não existem previsões passadas disponíveis para a data selecionada.

**Related Use Cases**: UC2.4

**Pre-conditions**:
- O professor deve estar autenticado.
- Os dados dos alunos e as previsões atuais devem estar disponíveis.
- Não existem previsões armazenadas para a data selecionada.

**Steps**:
- Aceder à pagina inicial do sistema.
- Clicar na opção "Previsão de Notas".
- Clicar na opção "Comparar Previsões".
- Não existem opções de dadas passadas.

**Expected Result:**
- O sistema deve exibir uma mensagem equivalente a: "Não existem previsões registadas anteriormente."
- O sistema desabilita a opção de "Comparar Previsões" se não houver dados atuais.

**Actual Result**: 

- Aprovado