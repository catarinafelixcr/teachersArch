**Test Case ID**: TC2.17

**Test Case Description**: Verificar se o relatório gerado contém as informações corretas e esperadas, como as notas dos grupos, estatísticas e a formatação adequada.

**Related Use Cases**: UC2.5

**Pre-conditions**:
- Relatório de notas gerado com sucesso (TC2.15 bem-sucedido).

**Steps**:
- Abrir o relatório PDF gerado.
- Verificar o conteúdo do relatório.

**Expected Result**:
- O relatório deve conter:
  1. Título claro e identificação do relatório (ex. "Relatório de Previsão de Notas dos Grupos").
  2. Data de geração do relatório.
  3. Notas de previsão para cada aluno, organizadas por grupo.
  4. Estatísticas resumidas por grupo (média, desvio padrão, etc.).
  5. Estatísticas globais (média geral, desvio padrão geral, percentis gerais).
  6. Formatação clara e legível.

**Actual Result**: