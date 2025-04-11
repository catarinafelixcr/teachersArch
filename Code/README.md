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

pip install django
pip install djangorestframework
pip install dj-rest-auth
pip install django-cors-headers
pip install djangorestframework-simplejwt
pip install psycopg2-binary
pip install django-allauth

(se não funcionar trocar o "-" por "_")

[pode ser possível ter que instalar mais alguma app que esteja em settings.py em /backend, na secção de installed_apps]

# Aplica migrações
python manage.py migrate

# Inicia o servidor Django
python manage.py runserver


## Frontend
    - cd /frontend

    - necessário instalar Node.js

# Instala dependências
npm install react-router-dom
npm install react-select
npm install react-plotly.js plotly.js

npm install

# Inicia a aplicação React
npm start

    - se der erro na página relacionado com SideBar.js basta colocar o nome do ficheiro na pasta /components para Sidebar.js ("b" minúsculo)
