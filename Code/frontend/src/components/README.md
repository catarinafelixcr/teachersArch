# Components

Esta pasta contém componentes React reutilizáveis para toda a aplicação.

## Função

Os componentes nesta pasta são blocos de construção modulares que podem ser utilizados em várias partes da aplicação. Elas podem servir para elementos como:

- Botões
- Formulários
- Tabelas
- Cards
- Modal/diálogos
- Barras de navegação
- Elementos de interface comuns

Nós usamos principalmente para o sidebar... já que temos na maioria das páginas.

## Como utilizar

Para utilizar um componente em outro componente ou página:

```jsx
import Button from '../components/Button';

function LoginPage() {
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form>
        {/* ... campos do formulário ... */}
        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
}
```

## Boas práticas

- Mantenham os componentes focados numa única responsabilidade
