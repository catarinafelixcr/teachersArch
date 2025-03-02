UC1.1 - Login com email e password.


– Primary Actor: Professor

– Scope/Goal: Autenticar o professor no sistema usando email e password

– Level: User Goal (Sea Level)

– Stakeholders and Interests: Professor (aceder ao sistema), Administrador do Sistema (segurança e integridade do sistema) e Desenvolvedores (implementar o login).

– Preconditions: O professor ter uma conta no site e conhecer o seu email e password.

– Main Success Scenario: 1- O professor acede a página de login; 2- O professor introduz o seu email e password nos respetivos campos; 3- O professor clica no botão de Login; 4- O sistema verifica se as credenciais são válidas; 5- O sistema autentica o professor; 6- O sistema redireciona o professor para a página inicial do site.

– Extensions:
- 3a: O email não está registar: 
    - 3a1:O sistema informa com uma mensagem que o email está válido
    - 3a2:O professor seleciona a opação "Sign Up"
- 3b: A password não está correta:
    - 3b1:O sistema informa com uma mensagem sobre a password estar incorreta
    - 3b2:O sistema verifica se a password está corretamente
- 5a: A base de dados não identifica o professor:
    - 5a1:O sistema informa com uma mensagem de erro
