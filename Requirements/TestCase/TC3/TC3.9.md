**Test Case ID:** TC3.9

**Test Case Description:** Verificar o comportamento do sistema quando ocorre uma falha inesperada durante a geração do relatório de desempenho.

**Related Use Cases**: UC3.3

**Pre-conditions**:
- O professor deve estar autenticado.
- Os dados dos alunos e as previsões devem estar disponíveis (mas simular uma condição que cause falha na geração, como falta de recursos do sistema ou erro interno).
- Previsões de desempenho exibidas com sucesso (TC3.1 bem-sucedido).

**Steps**:
- O professor está na dashboard.
- O professor seleciona a opção "Prediction of Grades".
- O sistema exibe as previsões categorizadas de todos os aluno do grupo (histórico).
- O professor escolhe a opção "Generate Report".

**Expected Result**:
- O sistema não deve gerar o relatório de desempenho em PDF.
- O sistema deve exibir uma mensagem de erro: "Erro ao gerar Report".

**Actual Result**: