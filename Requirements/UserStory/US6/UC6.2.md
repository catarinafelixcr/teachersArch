UC.6.2. Atualizar Dados do GitLab

**Primary Actor**: Professor.

**Scope**: O professor atualiza os dados do repositório GitLab no sistema, para a recolha das novas atividades dos alunos e reiniciando o processamento do modelo de Machine Learning.

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor (garante que o sistema tem acesso aos repositórios certos), alunos (beneficiam de previsões baseadas nos dados do GitLab), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (depende destes dados para gerar previsões precisas).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso à API do GitLab para validação do link.

**Main Success Scenario**:
1. O professor acede à dashboard;
2. Seleciona a opção "Insert Repository";
3. O professor insere o link do repositório do GitLab;
4. O sistema valida o link e associa-o a um repositorio já existente;
5. O sistema recolhe apenas as novas atividades desde a última atualização;
6. O sistema reinicia o processamento do modelo de Machine Learning;
7. O professor recebe uma mensagem "  ".

**Extensions**:

3a - O link fornecido não é válido
- 3a1. O sistema exibe uma mensagem: "Repository link must be a valid GitLab URL."

6a - O processamento do modelo de ML falha
- 6a1. O sistema exibe uma mensagem: " "
