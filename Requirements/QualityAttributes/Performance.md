**Contexto**

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, a performance impacta diretamente a experiência do usuário e a eficácia das previsões.

**Estímulo**

- o utilizador acede ao site e faz um pedido de previsão de desempenho com base nos dados do GitLab.
- o sistema precisa de processar os dados e gerar uma resposta sem muito tempo de demora.

**Artefato**

- o site com a interface com as várias funcionalidades e o modelo ML.

**Ambiente**

- acesso de vários utilizadores em simultâneo, com vários pedidos ao modelo e várias visualizações de retorno.

**Resposta**

- o sistema tem que processar os pedidos de previsão e mostrar os resultados rapidamente.

**Medida da Resposta**

A performance do sistema avalia-se com:

    - Latência: tempo médio de resposta do site ao carregar páginas e processar ações e tempo médio para o modelo de ML fornecer as suas previsões.

    - Capacidade de Processamento: número de previsões simultâneas que o sistema consegue suportar sem perder muito tempo de resposta.

    - Uso de recursos: Eficiência na utilização de CPU e da memória e otimizar o modelo de ML para reduzir o consumo de recursos.

    - Tempo de carregamento da interface: tempo necessário para renderizar as visualizações com os resultados das previsões.