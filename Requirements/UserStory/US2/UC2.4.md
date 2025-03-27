UC.2.4. Comparar a previsão em dois momentos distintos  

**Primary Actor**: Professor.

**Scope**: O professor acede ao sistema para comparar a previsão atual de notas dos alunos com previsões feitas em momentos anteriores.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (quer verificar se as previsões mudaram ao longo do tempo), instituição de ensino (pode usar essas comparações para entender melhor o impacto do tempo e da atividade dos alunos na precisão das previsões) e o sistema de previsão (fornece previsões de desempenho com base na atividade dos alunos).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso aos dados dos alunos e às previsões já treinadas pelo modelo de Machine Learning (dependente do US6). O sistema deve armazenar previsões anteriores feitas em diferentes momentos.

**Main Success Scenario**:  
1. O professor acede à dashboard;
2. Seleciona a opção "Previsão de Notas";
3. O sistema exibe o histórico das previsões para todos os alunos;
4. O professor seleciona a opção "Comparar Previsões";
5. O sistema apresenta opções para selecionar a data da previsão anterior a ser comparada;
6. O sistema apresenta estatísticas globais de ambas as previsões, como a media, desvio padrao;
7. O professor pode selecionar filtros para saber quem melhorou ou piorou;
8. O professor clica num aluno para obter uma comparação detalhada.

**Extensions**:

3a. As previsões apresentam um nível de confiança baixo.
- 3a1. O sistema exibe uma mensagem "Previsões com baixa confiança (probabilidade < 70%)."

3b. Não existe histórico de previsões.
- 3b1. O sistema exibe uma mensagem "Não existem previsões disponíveis."

5a. Não há previsões passadas disponíveis para comparação.
- 5a1. O sistema exibe uma mensagem: "Não existem previsões registadas para a data selecionada."

8a. Sem detalhes do aluno.
- 8a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."