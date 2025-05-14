UC4.2. Ver o desempenho dos grupos

**Primary Actor**: Professor.

**Scope**: Permite que os professores analisem o desempenho dos grupos no repositório, identificando alunos com risco de reprovação e facilitando intervenções pedagógicas.

**Level**: User goals (Sea level).

**Stakeholders**: Professor (precisa rapidamente de identificar alunos em risco de reprovar para agir cedo), alunos (Recebem acompanhamento mais restrito e personalizado), Instituição de Ensino (Quer reduzir a taxa de reprovação e melhorar o desempenho geral) e Sistema de Previsão (Providencia as previsões necessárias para apoiar as decisões pedagógicas).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do UC1 - Login feito). O sistema tem que ter acesso aos dados dos elementos do repositório e às previsões já processadas pelo modelo de Machine Learning (dependente do US6).

**Main Success Scenario**:

1. O professor acede à dashboard;
2. O professor seleciona a opção "Student at Risk";
5. O professor seleciona o botão para visualizar de um grupo à sua escolha.
6. O sistema processa os dados e exibe os elementos identificados como "em risco";
7. O professor clica num elemento para ver detalhes adicionais sobre a previsão do desempenho.

**Extensions**:

3b. O grupo não tem dados suficientes para análise.
- 3b1. O sistema exibe uma mensagem "Error fetching predictions:"
    
4a. Nenhum aluno está previsto para reprovação.
- 4a1. O sistema exibe uma mensagem não exibe mensagem.

7a. O professor clica num aluno, mas não há detalhes disponíveis
- 7qa1. O sistema exibe uma mensagem "Error fetching student details:"

