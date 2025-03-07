**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, sendo alguns sensíveis, garantir a segurança das informações e a integridade dos dados é essencial, tanto contra acessos indevidos, como ataques ou perdas.

**Estímulo**

- Um utilizador não consegue acessar dados sensíveis que não devem ser acessados sem permissões específicas, através de SQL injections ou ataques semelhantes.

**Artefato**

- Dados dentro do sistema, incluindo ids e logs de atividade do GitLab, previsões geradas e históricos de interações.

**Ambiente**

- Operação normal do sistema, com vários utilizadores a interagir em simultâneo e a tendo o modelo ML realizar previsões.

**Resposta**

- O sistema deve utilizar um sistema de tokens relativamente a questões de utilização da base de dados, de forma a que não ocorra o "leak" de dados sensíveis.


**Medida da Resposta**

A segurança do sistema é avaliada com:
- Criptografia: informações sensíveis armazenadas de forma encriptada, reduzindo o risco de exposição
- Controlo de acesso: implementação de autenticação (como OAuth ou JWT) e políticas de permissões para garantir que apenas utilizadores autorizados acedam a determinados dados.