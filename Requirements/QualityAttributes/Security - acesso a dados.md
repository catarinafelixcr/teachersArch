**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, sendo alguns sensíveis, garantir a segurança das informações e a integridade dos dados é essencial, tanto contra acessos indevidos, como ataques ou perdas.

**Estímulo**

- Um utilizador não consegue acessar dados sensíveis que não devem ser acessados sem permissões específicas.

**Artefato**

- Dados dentro do sistema, incluindo ids e logs de atividade do GitLab, previsões geradas e históricos de interações.

**Ambiente**

- Operação normal do sistema a modelo ML realizar previsões.

**Resposta**

- O sistema deve utilizar um sistema de tokens relativamente a questões de utilização da base de dados, de forma a que não ocorra o "leak" de dados sensíveis.


**Medida da Resposta**

Qualquer utilizador com sessão iniciada tem um token de autenticação associado (como OAuth ou JWT) para garantir que apenas acedam aos dados que são supostos, e caso queiram acessar dados indevidamente as informações sensíveis já estarão armazenadas de forma encriptada, reduzindo o risco de exposição.