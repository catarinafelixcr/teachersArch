# README - Guia de Instalação do Projeto

## Requisitos
- Python 3.11
- PostgreSQL com pgAdmin
- Node.js (para executar React)

## Configuração da BD
1. Instale PostgreSQL e pgAdmin
2. Crie uma base de dados chamada `pecd` com:
   - Nome: `pecd`
   - User: `postgres`
   - Password: `postgres`
   - Host: `localhost`
   - Port: `5432`

## Configuração do Ambiente

### Configuração do Backend
1. Abra um terminal na pasta do projeto
2. Crie e ative o ambiente virtual:
   ```
   # Criar ambiente virtual
   python3.11 -m venv .venv
   
   # Ativar ambiente virtual
   # Linux/Mac:
   source .venv/bin/activate
   # Windows:
   .venv\Scripts\activate
   ```
3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
4. Entre na pasta do backend:
   ```
   cd backend
   ```
5. Execute as migrações:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Inicie o servidor Django:
   ```
   python manage.py runserver
   ```
   O backend estará rodando em `http://127.0.0.1:8000/`

### Configuração do Frontend
1. Abra um novo terminal e navegue até a pasta do frontend:
   ```
   cd frontend
   ```
2. Instale as dependências:
   ```
   npm install
   npm install react@19.0.0 react-dom@19.0.0 react-router-dom@7.4.1 react-select@5.10.1
   npm install plotly.js@3.0.1 plotly.js-dist-min@3.0.1 react-plotly.js@2.6.0 recharts@2.15.2
   npm install axios@1.8.4 html2canvas@1.4.1 jspdf@3.0.1 jspdf-autotable@5.0.2
   npm install react-icons@5.5.0 lucide-react@0.503.0 react-confirm-alert@3.0.6
   ```
3. Inicie o aplicativo React:
   ```
   npm start
   ```
   O frontend estará disponível em `http://localhost:3000`

## Notas Importantes
- Certifica-te de usar Python 3.11 devido a compatibilidades específicas
- Vais precisar de manter os dois terminais (backend e frontend) ativos enquanto estiveres a usar o sistema