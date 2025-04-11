**Test Case ID**: TC2.12

**Test Case Title**: Filtrar previsões por tendência (melhoria, descida, etc.)

**Test Case Description**  
Verificar se o sistema filtra corretamente os alunos com base na tendência da sua evolução (status) ao longo do tempo, como *Improved*, *Declined*, *Slight Drop* ou *Unchanged*.

**Related Use Cases**: UC2.4 – Comparar a previsão em dois momentos distintos

**Pre-conditions**:
- O professor está autenticado no sistema.
- Existem dados de previsões atuais e anteriores.
- A funcionalidade de comparação está ativa (existem pelo menos 2 datas disponíveis).


**Steps**:
1. Aceder à página inicial do sistema.
2. Clicar na opção **"Previsão de Notas"**.
3. Clicar na opção **"Comparar Previsões"**.
4. No campo **"Select a tendency"**, escolher uma das opções disponíveis:
   - *Improved*
   - *Declined*
   - *Slight Drop*
   - *Unchanged*
5. Os valores mudam consoante o selecionado


**Expected Result**:
- O sistema deve atualizar a tabela ao mostrar apenas os alunos cujo campo “Status” corresponde à tendência selecionada.
- A tabela deve estar correta tanto para a previsão atual quanto para a anterior.

**Status**:

- Aprovado
