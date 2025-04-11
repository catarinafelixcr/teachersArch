# Nome do Projeto

    - Webstite de apoio ao Professor 

## Demonstração

[localhost:3000/]

    - alterar o que vem à frente da barra com a página que quer visualizar


## Tecnologias utilizadas

- **Frontend:** React.js
- **Backend:** Python,Django REST Framework
- **Ferramentas:** django-cors-headers

## Instalação

# Backend 
    - cd /backend

# Cria ambiente virtual (opcional, mas recomendado)
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows

# Instala dependências
pip install -r requirements.txt

pip install dj_rest_auth
pip install rest_framework
pip install corsheaders

[pode ser possível ter que instalar mais alguma app que esteja em settings.py em /backend, na secção de installed_apps]

# Aplica migrações
python manage.py migrate

# Inicia o servidor Django
python manage.py runserver


## Frontend
    - cd /frontend

    - necessário instalar Node.js

# Instala dependências
npm install

# Inicia a aplicação React
npm start
