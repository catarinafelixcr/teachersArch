# Backend

Esta pasta contém a configuração principal do projeto Django.

## Função

É aqui que estão definidos os ficheiros principais de arranque e configuração do servidor backend com Django.

## Estrutura

- `__init__.py`: Indica que esta pasta é um módulo Python. NUNCA APAGAR!
- `asgi.py`: Configuração para o servidor ASGI (usado para aplicações assíncronas).
- `wsgi.py`: Configuração para o servidor WSGI (modo padrão do Django).
- `settings.py`: Ficheiro de configuração principal do Django (BD, apps, segurança, etc.).
- `urls.py`: Define as rotas globais da aplicação (liga as URLs às views ou APIs).

## Notas

- O ficheiro mais importante aqui durante o desenvolvimento é o `settings.py` (por exemplo, para ativar novas apps ou configurar o CORS).
- As rotas que apontam para a app `api/` estão definidas em `urls.py`.
