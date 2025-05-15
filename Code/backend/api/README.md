# API

Esta pasta representa a app principal da API no projeto Django.

## Função

Aqui estão definidos os modelos de dados, as views, os serializadores e as rotas para a API REST. É o coração da lógica da aplicação.

## Estrutura

- `__init__.py`: Torna esta pasta num módulo Python.
- `admin.py`: Permite registar modelos na interface de administração do Django.
- `apps.py`: Define a configuração da app no Django.
- `models.py`: Define os modelos (estruturas de dados que se ligam à BD).
- `serializers.py`: Converte os modelos em JSON e vice-versa (usado pelo Django REST Framework).
- `views.py`: Define a lógica das respostas às requisições HTTP (GET, POST, etc.).
- `urls.py`: Liga os endpoints definidos em `views.py` a rotas da API.
- `tests.py`: Ficheiro para testes automáticos.
- `migrations/`: Guarda os registos das alterações feitas aos modelos da base de dados.
- `ml_models/`: Contém scripts ou ficheiros relacionados com modelos de machine learning.
- `utils/`: Funções auxiliares ou módulos reutilizáveis.

## Notas

- Esta app é registada no `settings.py` do projeto principal para ser reconhecida como parte do backend.
- Os endpoints definidos aqui são usados pelo frontend para aceder a dados, prever desempenho, etc.
- A pasta `ml_models` pode conter ficheiros `.pkl`, modelos treinados ou scripts de predição.

