**Test Case ID:** TC2.9

**Test Case Description**: Verificar o comportamento do sistema quando ocorre uma falha inesperada durante a geração do relatório.

**Related Use Cases**: UC2.3

**Pre-conditions**:
- O professor deve estar autenticado.
- Os dados dos alunos e as previsões devem estar disponíveis (mas simular uma condição que cause falha na geração, como falta de recursos do sistema ou erro interno).
- Previsões de notas exibidas com sucesso (TC2.1 bem-sucedido).

**Steps**:
- Clicar na opção "Generate Reporto".

**Expected Result**:
- O sistema não deve gerar o relatório em PDF.
- O sistema deve exibir uma mensagem de erro: "Falha ao gerar o relatório. Por favor, tente novamente mais tarde."

**Actual Result**: