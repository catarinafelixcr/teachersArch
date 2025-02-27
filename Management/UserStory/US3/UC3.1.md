Use Case: Previsão de Desempenho Qualitativo da Turma e de um Aluno Singular

Primary Actor: Educador – O professor que deseja obter previsões de desempenho para identificar quais alunos precisam de maior atenção.

Scope: O sistema permite que os educadores observem previsões de desempenho qualitativo dos alunos, para que possam identificar aqueles com maior risco de reprovação e tomar decisões pedagógicas apropriadas.


Level: User Goals (Sea Level) – O caso de uso foca no objetivo do usuário ao interagir com o sistema para obter previsões.
Stakeholders 
- Educador: Precisa identificar rapidamente alunos com baixo desempenho para agir com antecedência.  
- Estudantes: Beneficiam-se de um acompanhamento mais personalizado para melhorar seu aprendizado.  
- Instituição de Ensino: Quer reduzir a taxa de reprovação e melhorar o desempenho geral dos alunos.  
- Sistema de Previsão: Processa dados e gera previsões para apoiar a tomada de decisão pedagógica.  

Preconditions
- O educador deve estar autenticado no sistema.  
- O sistema deve ter acesso aos dados acadêmicos dos alunos e às previsões geradas pelo modelo de análise.  

Main Success Scenario:
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

Extensions:
1A – O educador deseja visualizar previsões de um único aluno  
1A.1. Em vez de selecionar a turma completa, o educador pesquisa pelo nome ou matrícula de um aluno específico.  
1A.2. O sistema exibe a previsão qualitativa individual do aluno.  
1A.3. O fluxo retorna ao passo 7 do fluxo principal.  

2A – Dados insuficientes para previsão  
2A.1. O sistema alerta o educador sobre a falta de dados para um ou mais alunos.  
2A.2. O educador pode inserir novos dados ou solicitar informações adicionais da instituição.  
