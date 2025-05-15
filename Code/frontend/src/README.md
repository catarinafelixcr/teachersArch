# Src

Esta pasta contém todo o código-fonte da aplicação React.

## Estrutura

- `assets/`: Recursos como imagens, fontes ou outros ficheiros estáticos que são importados pelo código React.
- `components/`: Componentes React reutilizáveis em toda a aplicação.
- `pages/`: Componentes React que representam páginas completas da aplicação.
- `services/`: Funções e classes para acesso a APIs externas e serviços de dados.
- `styles/`: Ficheiros CSS ou SCSS para estilizar a aplicação.

## Função

Esta pasta é o coração da aplicação React. Todo o código JavaScript, componentes React e lógica da aplicação são organizados aqui. A estrutura modular facilita-nos MUITO a mexer na aplicação.

## Como funciona

- Os componentes em `components/` são blocos de construção reutilizáveis que podem ser usados em várias páginas, como por exemplo a barra lateral.
- As páginas em `pages/` representam vistas completas da aplicação, geralmente associadas a rotas específicas.
- Os serviços em `services/` encapsulam a lógica de comunicação com APIs, incluindo chamadas para o backend.
- Os estilos em `styles/` definem a aparência visual da aplicação.

## Notas importantes

- Quando adicionares novos componentes ou páginas, tenta seguir a estrutura e padrões de nomeação existentes... Assim é mais facil e os teus colegas saberão onde está cada coisa.