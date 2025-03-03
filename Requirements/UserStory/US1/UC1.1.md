UC1.1 - Login com email e password.


**Primary Actor**: Professor.

**Scope/Goal**: Autenticar o professor no sistema usando email e password.

**Level**: User Goal (Sea Level).

**Stakeholders and Interests**: Professor (aceder ao sistema), Administrador do Sistema (segurança e integridade do sistema) e Desenvolvedores (implementar o login).

**Preconditions**: O professor deve ter uma conta registada no sistema. O professor deve conhecer as suas credenciais (email e password). O sistema deve estar operacional e conectado à base de dados.


**Main Success Scenario**: 
1. O professor acede à página de login; 
2. O professor introduz o seu email e password; 
3. O professor clica no botão de Login; 
4. O sistema verifica se as credenciais são válidas; 
5. O sistema autentica o professor; 
6. O sistema redireciona o professor para a página inicial.

**Extensions**:

3a: As credenciais estão incorretas: 
- 3a1: O sistema exibe uma mensagem "Email ou password incorretos."
- 3a2: O professor pode tentar novamente introduzindo novas credenciais.
- 3a3: O professor pode clicar em "Esqueci-me da password" para recuperar o acesso.
- 3a4: O sistema mantém um registo do número de tentativas falhadas.
- 3a5: Após cinco tentativas consecutivas falhadas, o sistema bloqueia temporariamente a conta.
- 3a6: O sistema exibe uma mensagem "Muitas tentativas falhadas. Tente novamente em 15 minutos ou redefina a password."

4a: A base de dados não identifica o professor:
- 4a1: O sistema exibe a mensagem "Ocorreu um erro no sistema. Tente novamente mais tarde.
