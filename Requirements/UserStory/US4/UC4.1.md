UC4.1 - Ver o desempenho dos alunos.

**Primary Actor**: Professor.

**Scope**: O sistema permite que os professores identifiquem quais alunos têm previsão de reprovação, levando à tomada de decisões e intervenções pedagógicas.

**Level**: User goals (Sea level).

**Stakeholders**: Professor (precisa rapidamente identificar elementos do repositório em risco de reprovar para agir cedo), alunos (recebem acompanhamento mais restrito e personalizado), Instituição de Ensino (Qqer reduzir a taxa de reprovação e melhorar o desempenho geral).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do UC1 - Login feito). O sistema tem que ter acesso aos dados dos elementos do repositório e às previsões já processadas pelo modelo de Machine Learning (dependente do US6).

**Main Success Scenario**:

1. O professor acessa à dashboard;
2. O professor seleciona a opção "Student at Risk";
3. O professor seleciona o grupo;
4. O sistema processa os dados e exibe os alunos identificados como "High Risk";
5. O professor clica num aluno para ver detalhes adicionais sobre a previsão do desempenho.

**Extensions**:

3a. O grupo não tem dados suficientes para análise.
- 3a1. O sistema exibe uma mensagem "Error fetching predictions:"
    
4a. Nenhum aluno está previsto para reprovação.
- 4a1. O sistema exibe uma mensagem "No students found"

5a. O professor clica num aluno, mas não há detalhes disponíveis
- 5a1. O sistema exibe uma mensagem "Error fetching student details:"

