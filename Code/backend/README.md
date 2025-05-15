# Backend

Este diretório contém toda a implementação do servidor backend do projeto. Nós utilizamos Django porque havia no grupo quem já tivesse trabalhado com este anteriormente. E, de facto, foi a melhor opção! É muito facil de entender e de se trabalhar.

## Estrutura

- `api/`: Contém as definições de API REST e endpoints do sistema.
- `backend/`: Configurações principais do projeto Django.
- `venv/`: Ambiente virtual específico para o backend (opcional). --> ja temos no de cima, eu pessoalmente prefiro este mas é a gosto - equivalente, mas usa sempre o mesmo quando criares.
- `manage.py`: Script Django para gerir o projeto (migrações, servidor, etc.).
- `requirements.txt`: Lista de dependências Python necessárias.

## Como executar o backend

1. Certifica-te que estás a usar Python versão 11.

2. Ativa o ambiente virtual (caso ainda não o tenhas feito na pasta principal):
   ```
   source ../.venv/bin/activate  # Linux/Mac
   ..\.venv\Scripts\activate     # Windows
   ```

3. Instala as dependências:
   ```
   pip install -r requirements.txt
   ```

4. Aplica as migrações da base de dados:  ESTE É NECESSÁRIO QUANDO FAZEMOS ALTERAÇÕES NO MODELS
   ```
   python manage.py makemigrations  # Cria as tabelas da BD
   python manage.py migrate         # Aplica as migrações
   ```

5. Inicia o servidor Django: ISTO É OBRIGATÓRIO SEMPRE PARA CORRER!
   ```
   python manage.py runserver
   ```

O servidor ficará disponível em `http://127.0.0.1:8000/`.
Mas como vais ter o frontend ligado ao mesmo tempo, e eles vão estar associados, podes trabalhar na diretoria do frontend também.

## Notas importantes

- O backend depende de uma base de dados que deve estar criada previamente no teu PC.
- Certifica-te que todas as variáveis de ambiente necessárias estão configuradas.
- Para aceder à interface de administração, usa o URL `http://127.0.0.1:8000/admin/`.