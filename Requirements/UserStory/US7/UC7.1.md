UC7.1. - Registar um novo Professor.

**Primary Actor**: Professor.

**Scope**: O professor inicia o processo de registo para criar uma nova conta no sistema.

**Level**: User goals – Sea level.

**Stakeholders**: Professor (precisa de acesso ao sistema para usar as suas funcionalidades), Instituição de Ensino (necessita de um sistema de registo seguro e eficaz para gerir o acesso de professores), Sistema de Previsão (precisa de gerir contas de utilizadores e garantir a segurança do acesso).

**Preconditions**: O sistema de registo de professores deve estar acessível.

**Main Success Scenario:**
1. O professor acede à página de registo.
2. O sistema exibe o formulário de registo com os campos necessários (nome, email institucional, password, etc.).
3. O professor preenche o formulário com os seus dados.
4. O professor submete o formulário.
5. O sistema valida os dados introduzidos (formato do email, password complexidade, campos obrigatórios).
6. O sistema verifica se o email institucional já está registado.
7. O sistema cria uma nova conta de professor na base de dados.
8. O sistema envia um email de confirmação de registo para o email institucional fornecido.
9. O sistema informa o professor que o registo foi bem-sucedido e que pode agora iniciar sessão.

**Extensions**:

5a. Validação de dados falha.
- 5a1. O sistema exibe uma mensagem de erro clara e específica junto ao campo inválido, indicando o problema ("Enter a valid address", "Password must be at least 8 characters"). O sistema mantém os dados corretos já introduzidos no formulário para facilitar a correção.

6a. Email institucional já registado.
- 6a1. O sistema exibe uma mensagem de erro informando que o email institucional já está associado a uma conta existente e pode sugerir a recuperação de password.

7a. Falha na criação da conta na base de dados.
- 7a1. O sistema exibe uma mensagem de erro informando que ocorreu um problema inesperado durante o registo e sugere tentar novamente mais tarde ou contactar o suporte técnico.