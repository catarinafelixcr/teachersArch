**Test Case ID:** TC2.12

**Test Case Description:** Verificar o comportamento do sistema quando não há dados de previsão atuais disponíveis para comparação com previsões passadas.

**Related Use Cases:** UC2.4

**Pre-conditions**:
- O professor deve estar autenticado.
- O sistema tem armazenado previsões anteriores.
- Não existem dados de previsão atuais disponíveis no sistema.

**Steps**:
- Aceder à dashboard do sistema.
- Clicar na opção "Previsão de Notas".
- Clicar na opção "Comparar Previsões".
- Selecionar uma data para a previsão anterior a ser comparada.

**Expected Result:**
- O sistema deve exibir uma mensagem: "Não é possível comparar as previsões porque não existem dados de previsão após a data data. Por favor atualize a base de dados para comparar."
- O sistema desabilita a opção de "Comparar Previsões" se não houver dados atuais.

**Actual Result**: