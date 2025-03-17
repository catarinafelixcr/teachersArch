**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, sendo alguns sensíveis, garantir a segurança das informações e a integridade dos dados é essencial, tanto contra ataques como perdas.

**Estímulo**

- Um utilizador não consegue eliminar dados do sistema, o que causaria perdas de dados significativas tanto para o conjunto de dados como para a performance do modelo ML.

**Artefato**

- Dados dentro do sistema, incluindo ids e logs de atividade do GitLab, previsões geradas e históricos de interações.

**Ambiente**

- Operação normal do sistema, com vários utilizadores a interagir em simultâneo e a tendo o modelo ML realizar previsões.

**Resposta**


- Caso algum dado seja apagado indevidamente, o sistema deve permitir a recuperação da versão anterior, correta.

**Medida da Resposta**

Caso um indivíduo altere informações sobre alunos cada remoção de dados é registada num registo de logs, o que proporciona mais controlo para investigar ações suspeitas; existe também controlo sobre o tipo de dados que cada utilizador poderá remover devido ao facto de que cada utilizador corresponde um token com permissões associadas e existe um backup dos dados para que caso essa remoção seja indevida ou engano se possam recuperar os dados corretos.