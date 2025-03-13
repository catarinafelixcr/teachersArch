**Test Case ID**: TC2.3

**Test Case Description**: O sistema deve verificar se a previsão do modelo de previsão está com baixa confiança, e se assim for, informar o professor.

**Related Use Cases**: UC2.1, UC2.2

**Pre-conditions:**
- O professor deve estar autenticado no sistema.
- Os dados dos alunos e as previsões processadas pelo modelo de Machine Learning devem estar disponíveis no sistema.
- As previsões de notas foram previamente calculadas e têm um nível de confiança baixo (probabilidade < 70%).

**Steps**:
- Aceder à dashboard do sistema.
- Clicar na opção "Previsão de Notas".

**Expected Result**:
- O sistema deve exibir uma mensagem "Previsões com baixa confiança (probabilidade < 70%)."

**Actual Result:**