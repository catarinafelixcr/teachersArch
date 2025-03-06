Understand the context: 
- o sistema neste caso é um site, com várias funcionalidades, em que se vai demonstrar um modelo de Machine Learning (ML), que prevê o desempenho dos alunos ao longo do semestre com base na atividade no GitLab.
- o site deve processar as previsões de forma rápida, de modo ao utilizador ter uma melhor experiência ao usá-lo.
- o site deve processar de forma eficiente os dados da atividade do GitLab e deve suportar vários utilizadores ao mesmo tempo.

Definir a Arquitetura: Client-server ( e Layered)
- Subsistemas:

•	Frontend (Client-side): mecanismos de cache para armazenar dados estáticos, e otimizar chamadas da API para reduzir pedidos desnecessários.

•	Backend (Server-side): onde se encontra o modelo ML para fazer as previsões e para lidar com os pedidos que o utilizador faz, processando os dados e retornar as respostas.

•	Base de Dados: armazena a informação processada	do GitLab e as previsões.

•	Integração da API do GitLab: para obter os dados da atividade do GitLab dos alunos.

- Responsabilidades dos subsistemas:

•	Frontend – minimizar chamadas da API, otimizar a velocidade de carregamento da página.

•	Backend – otimizar o processamento de dados e assegurar respostas de baixa latência.

•	Base de dados – uso de queries, indexar e cache.

•	API do GitLab – processa os dados assincronamente e gere limites de pedidos.


Coupling: (Low Coupling)
- os subsistemas (frontend, backend, base de dados e API do GitLab), devem interagir muito pouco, de modo a que alterações num dos subsistemas não devem modificar os outros subsistemas.


Cohesion: (High Cohesion)
- cada subsistema deve ter um propósito claro e coeso, de modo que os subsistemas estão relacionados com um objetivo.

Architectual Patterns:
- Client-server: o site vai seguir um modelo padrão de cliente servidor onde o frontend, que vai ser o utilizador (client), faz um pedido e o backend, que é o servidor, processa o pedido e retorna as previsões, pelo que desta forma, reduzimos a carga de trabalho do utilizador.
- Layered pattern: o site tem 3 camadas, que são, camada da apresentação (Frontend UI), camada da aplicação (Backend API) e camada de dados (Base de dados e integração do GitLab). Ao termos estas 3 camadas, conseguimos otimizar cada uma delas individualmente. 
- Caching patterns: reduz redundância e acelera o retorno dos dados.
