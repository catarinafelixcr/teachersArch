**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. A testabilidade do sistema é essencial para garantir que todas as funcionalidades, incluindo a interface do utilizador e a precisão do modelo de ML, possam ser verificadas de forma eficiente, garantindo confiabilidade e facilidade na sua manutenção.

**Estímulo**

- O examinador executa testes automatizados e interage com a interface para avaliar a rapidez na resposta do sistema.

**Artefato**

- Código-fonte, API do modelo de ML e interface do utilizador.

**Ambiente**

- Execução em pipeline CI/CD, diferentes dispositivos e cenários com carga elevada.

**Resposta**

- Os testes devem ser rápidos para não comprometer o desenvolvimento e garantir uma boa experiência ao utilizador.

**Medida da Resposta**

- Tempo médio de execução dos testes automatizados e tempo de resposta da interface ao processar previsões (exemplo: 90% dos testes concluídos em X minutos).
