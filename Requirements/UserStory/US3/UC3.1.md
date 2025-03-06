UC3.1 - Previsão de Desempenho Qualitativo da Turma e de um Aluno Singular


**Primary Actor**: Professor.

**Scope/Goal**: O sistema permite que os professores observem previsões de desempenho qualitativo dos alunos, para que possam identificar aqueles com maior risco de reprovação e tomar decisões pedagógicas apropriadas.

**Level**: User Goals (Sea Level).

**Stakeholders and Interests**:
- Professor: Precisa identificar rapidamente alunos com baixo desempenho para agir com antecedência.  
- Instituição de Ensino: Quer reduzir a taxa de reprovação e melhorar o desempenho geral dos alunos.  
- Sistema de Previsão: Processa dados e gera previsões para apoiar a tomada de decisão pedagógica.  

**Preconditions**:  O professor deve estar autenticado no sistema. O sistema deve ter acesso aos dados dos alunos e às previsões geradas pelo modelo de análise.

**Main Success Scenario**:
1. O educador acessa a plataforma do sistema.  
2. O sistema apresenta opções para visualizar previsões de desempenho:  
   - Da turma inteira  
   - De um aluno específico  
3. O educador seleciona a opção desejada.  
4. O sistema exibe uma lista com os alunos e suas respectivas previsões de desempenho qualitativo.  
5. O educador pode filtrar os alunos com maior risco de reprovação.  
6. O sistema destaca visualmente os alunos com previsão de baixo desempenho (exemplo: em vermelho).  
7. O educador clica em um aluno para visualizar detalhes adicionais, como histórico de notas e fatores de risco.  
8. O educador pode exportar o relatório ou tomar decisões pedagógicas informadas.  

**Extensions**:
1a: O educador deseja visualizar previsões de um único aluno  
- 1a1: Em vez de selecionar a turma completa, o educador pesquisa pelo nome ou matrícula de um aluno específico.  
- 1a2: O sistema exibe a previsão qualitativa individual do aluno.  
- 1a3: O fluxo retorna ao passo 7 do fluxo principal.  

2a: Dados insuficientes para previsão  
- 2a1. O sistema alerta o educador sobre a falta de dados para um ou mais alunos.  
- 2a2. O educador pode inserir novos dados ou solicitar informações adicionais da instituição.  
