UC.6.1. Inserir Link do Repositório GitLab

**Primary Actor**: Professor.

**Scope**: O professor fornece um link do repositório GitLab ao sistema, permitindo a recolha dos dados de atividade dos alunos e inicia o processamento do modelo de Machine Learning.

**Level**: User goals – Sea level.

**Stakeholders and Interests**: Professor (garante que o sistema tem acesso aos repositórios certos), alunos (beneficiam de previsões baseadas nos dados do GitLab), instituição de ensino (procuram melhorar a qualidade do ensino) e o sistema de previsão (depende destes dados para gerar previsões precisas).

**Preconditions**: O professor deve estar autenticado no sistema (dependente do US1). O sistema deve ter acesso à API do GitLab para validação do link.

**Main Success Scenario**:
1. O professor acede à dashboard;
2. Seleciona a opção "Inserir dados de GitLab";
3. O professor insere o link do repositório GitLab;
4. O sistema valida o link;
5. O sistema recolhe os dados do GitLab e armazena-os;
6. O sistema inicia automaticamente o processamento do modelo de Machine Learning;
7. O professor recebe uma mensagem "Os dados foram recolhidos com sucesso e o modelo de Machine Learning está a processar as previsões. Em breve, poderá consultá-las."


**Extensions**:

3a - O link fornecido não é válido
- 3a1. O sistema exibe a mensagem: "O link do repositório GitLab não é válido ou está inacessível."

6a - O processamento do modelo de ML falha
- 6a1. O sistema exibe uma mensagem: "Os dados foram recolhidos, mas ocorreu um erro ao gerar as previsões. Tente novamente mais tarde."
- 6a2. O sistema gera um log de erro e notifica o administrador para revisão do problema.