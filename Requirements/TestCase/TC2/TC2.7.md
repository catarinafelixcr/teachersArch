**Test Case ID**: TC2.7

**Test Case Title**: Filtragem previsões 

**Test Case Description**: Verificar se o sistema filtra corretamente os alunos com base na tendência da sua evolução ("Trend") ao longo do tempo, como *Improved*, *Declined*, ou *Unchanged*, representados com emojis.

**Related Use Cases**: UC2.2 

**Pre-conditions**:

- O professor está autenticado no sistema.

- Existem dados de previsões atuais e anteriores.

- A funcionalidade de comparação está ativa (existem pelo menos 2 datas disponíveis).


**Steps**:

- Aceder à página inicial do sistema.

- Clicar na opção "Prediction of Grades.

- Clicar na opção "Compare over Time".

- Na tabela de compração, existe uma coluna que exibe a tendência do aluno de acordo com o emoji que representa ("Improved", "Declined" ou "Unchenged")


**Expected Result**:

- O sistema deve atualizar a tabela ao mostrar apenas os alunos cujo campo “Status” corresponde à tendência selecionada.

- A tabela deve estar correta tanto para a previsão atual quanto para a anterior.

**Status**:

- Aprovado
