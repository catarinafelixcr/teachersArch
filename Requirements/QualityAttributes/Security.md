**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, sendo alguns sensíveis, garantir a segurança das informações e a integridade dos dados é essencial, tanto contra ataques como perdas.

**Estímulo**

- Um utilizador autenticado tenta modificar ou adulterar os dados do sistema, seja alterando os dados de entrada para o modelo de ML ou tentando modificar os resultados armazenados.
- Um utilizador tenta acessar dados sensíveis que não devem ser extraídos, através de SQL injections ou ataques semelhantes.

**Artefato**

- Dados dentro do sistema, incluindo ids e logs de atividade do GitLab, previsões geradas e históricos de interações.

**Ambiente**

- Operação normal do sistema, com vários utilizadores a interagir em simultâneo e a tendo o modelo ML realizar previsões.

**Resposta**

- O sistema deve manter um registo de todas as alterações feitas nos dados e prevenir alterações não autorizadas.
- Caso algum dado seja alterado indevidamente, o sistema deve permitir a recuperação da versão anterior, correta.

**Medida da Resposta**

A segurança do sistema é avaliada com:
    - Registo de auditoria: cada modificação de dados é registada, o que proporciona mais controlo para investigar ações suspeitas.
    - Detecção e prevenção de alterações indevidas: ter ferramentas que impedem que utilizadores não autorizados modifiquem os dados.
    - Restauração dos dados: caso ocorra uma alteração indevida, a versão correta dos dados deve ser restaurada num prazo máximo de 24 horas.





