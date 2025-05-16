**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, a performance impacta diretamente a experiência do usuário e a eficácia das previsões.

**Estímulo**

- o utilizador acede ao sistema, insere o link do repositório GitLab e o token, seleciona o Model Stage desejado e solicita a previsão do desempenho com base no repositório escolhido.

**Artefato**

- o sistema com a interface de submissão de link e do token, modelo de previsão e pipeline de extração.

**Ambiente**

- o sistema está operacional com vários utilizadores simultâneos, cada um a realizar inserções de links e tokens para diferentes repositórios GitLab.

**Resposta**

- o sistema retorna os alunos do repositório do GitLab correspondente aos dados que o utilizador introduziu.

**Medida da Resposta**

- O sistema demora até 15 minutos a extrair os dados. Este tempo inclui a autenticação com a API do GitLab, extração e processamento dos dados, e formatação da resposta.