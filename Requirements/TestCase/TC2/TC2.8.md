**Test Case ID**: TC2.15

**Test Case Description**: Verificar se o sistema permite gerar e fazer o download de um relatório de notas dos alunos em formato PDF quando todos os dados estão disponíveis.

**Related Use Cases**: UC2.3

**Pre-conditions**:

- O professsor deve estar autenticado.

- Previsões de notas exibidas com sucesso (TC2.1 bem-sucedido).

**Steps**:

- Clicar na opção "Gerar relatório".

- Verificar se o sistema gera o relatório em formato PDF.

- Fazer o download do relatório.

**Expected Result:**

- O sistema deve gerar um relatório de notas em formato PDF.

- O download do relatório deve iniciar com sucesso.

- O relatório em PDF deve conter as notas dos grupos de alunos, estatísticas relevantes (média, desvio padrão, percentis, etc.) e outras informações pertinentes conforme definido no design do relatório.

**Actual Result**: