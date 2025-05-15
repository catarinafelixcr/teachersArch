Aqui, temos toda a base do código do projeto.

## Estrutura

- `.venv/`: Ambiente virtual do Python com todas as dependências necessárias para o backend. --> cada um de nós tem o seu ambiente virtual. ATENÇÃO TEM DE SER PYTHON VERSÃO 11 devido a algumas compatibilidades de bibliotecas.
- `backend/`: Implementação da lógica do backend, como APIs, manipulação de dados e integrações com BD ou serviços externos.
- `frontend/`: Interface, construída para visualização e interação com o sistema.
- `gitlab_miguel/`: Testes ou código de integração com GitLab, desenvolvidos pelo Miguel.
- `gitlabAPI/`: Módulo principal de interação com a API do GitLab.
- `gitlabAPI_copy_copy/`: Vversão alternativa da `gitlabAPI`
- `gitlabAPI_Luciana/`: Versão personalizada e testes feitos pela Luciana para interação com a API do GitLab.
- `gitlabAPI_model_cat/`: Versão personalizada e testes feitos pela Catarina para interação com a API do GitLab.
- `POEMS/`: Para o tuturial.

## Arquivos adicionais

- `.gitignore`: Lista de arquivos e pastas a serem ignoradas pelo Git.
- `.gitkeep`: Ficheiro placeholder para garantir que pastas vazias sejam versionadas no Git.

## Como utilizar

Precisas de 2 terminais. Um correrá o backend e outro o frontend. Além disso, precisas de etr a BD criada no teu pc.

Num dos terminais:
1. Precisas de ativar o ambiente virtual:
   -  source .venv/bin/activate (Linux/Mac) ou .venv\Scripts\activate (Windows)
Se ainda não tens, cria-o em versão python 11:
   - python3.11 -m venv .venv

2. Instala as dependências:
   - pip install -r requirements.txt

3. Acede à pasta backend e siga as instruções do respetivo README:
   - cd backend

No outro terminal:
1. Não precisas necessáriamente de um ambiente virtual, é opcional.

2. Acede à pasta backend e siga as instruções do respetivo README:
   - cd frontend

Quanto à BD, obtamos por usar pgAdmin:

1. Certifica-te de que tens o PostgreSQL e o pgADMIN instalado e a base de dados criada com os seguintes dados:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pecd',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

