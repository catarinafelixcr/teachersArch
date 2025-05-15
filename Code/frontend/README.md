# Frontend

Este diretório contém toda a implementação da interface de utilizador do projeto. Usamos React.

## Estrutura

- `node_modules/`: Dependências do Node.js (gerado automaticamente).
- `public/`: Ficheiros públicos estáticos, incluindo o HTML principal.
- `src/`: Código-fonte da aplicação React.
- `.gitignore`: Lista de ficheiros e pastas a serem ignoradas pelo Git.
- `package-lock.json`: Ficheiro gerado automaticamente para versões exatas de dependências.
- `package.json`: Configuração do projeto Node.js e dependências.

## Como executar o frontend

1. Instala as dependências do projeto:
   ```
   npm install
   ```

2. Instala bibliotecas específicas necessárias:
   ```
   npm install react-router-dom
   npm install react-select
   npm install react-plotly.js plotly.js
   ```

3. Inicia a aplicação React:
   ```
   npm start
   ```

A aplicação ficará disponível em `http://localhost:3000`.

## Notas importantes

- Certifica-te que o backend está a correr antes de iniciar o frontend para garantir a comunicação adequada entre os dois.
- A interface React comunica com a API através de chamadas que são definidas nos ficheiros da pasta `src/`.
- Podes personalizar a porta em que a aplicação é executada no ficheiro `package.json` se necessário.