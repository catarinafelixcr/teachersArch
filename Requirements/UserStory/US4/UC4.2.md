
**Primary Actor**: Professor.

**Scope/Goal**: Permite que os professores analisem o desempenho dos grupos no repositório, identificando alunos com risco de reprovação e facilitando intervenções pedagógicas.

**Level**: User goals (Sea level).

**Stakeholders**: Professor (Precisa rapidamente identificar os grupos do repositório em risco de reprovar para agir cedo), elementos do repositório (Recebem acompanhamento mais restrito e personalizado), Instituição de Ensino (Quer reduzir a taxa de reprovação e melhorar o desempenho geral) e Sistema de Previsão (Providencia as previsões necessárias para apoiar as decisões pedagógicas).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do UC1 - Login feito). O sistema tem que ter acesso aos dados dos elementos do repositório e às previsões já processadas pelo modelo de Machine Learning.


**Main Success Scenario**:

1. O professor acessa à dashboard;
2. O professor seleciona a opção "Prever o desempenho";
3. O professor visualiza as notas de todos os elementos do repositório;
4. O professor ativa a opção "Alunos em risco de reprovação".
5. O sistema processa os dados e exibe os elementos identificados como "em risco".
6. O professor clica num elemento para ver detalhes adicionais sobre a previsão do desempenho.

**Extensions**:

3a. O modelo de ML não retorna previsões.
- 3a1. O sistema exibe uma mensagem "Os dados de previsão não estão disponíveis de momento. Tente novamente mais tarde."

3b. O grupo não tem dados suficientes para análise.
- 3b1. O sistema exibe uma mensagem "Não há dados suficientes sobre este grupo."
    
4a. Nenhum aluno está previsto para reprovação.
- 4a1. O sistema exibe uma mensagem "Nenhum aluno em risco de reprovação."

5a. O professor clica num aluno, mas não há detalhes disponíveis
- 5a1. O sistema exibe uma mensagem "De momento, não existem dados adicionais sobre este aluno."

