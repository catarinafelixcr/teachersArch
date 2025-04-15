**Test Case ID**: TC2.9 

**Test Case Description**: Verificar o comportamento do sistema quando o utilizador seleciona apenas um grupo para comparar.

**Related Use Cases**: UC2.3

**Pre-conditions**:
- O professor deve estar autenticado no sistema.
- Os dados dos alunos, as previsões processadas pelo modelo de Machine Learning e a associação de alunos a grupos devem estar disponíveis.
- Previsões de notas exibidas com sucesso (TC2.1 bem-sucedido).

**Steps**:
- Clicar na opção "Comparar notas de grupos".
- Selecionar apenas um grupo na lista de grupos disponíveis.
- Tentar iniciar a comparação.

**Expected Result**:
- O sistema deve exibir uma mensagem de erro ou aviso: "Selecione pelo menos dois grupos para comparar as previsões de notas."

**Actual Result**: 

    - Aprovado.