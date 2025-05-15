# Services

Esta pasta contém funções e classes responsáveis pela comunicação com APIs e serviços externos.

## Função

Os serviços encapsulam a lógica de acesso a dados e APIs externas, separando estas preocupações dos componentes da interface.

## Serviços comuns

- `api.js`: Configuração base para chamadas à API (como axios, fetch, etc.)
- `authService.js`: Funções relacionadas a autenticação e autorização
- `userService.js`: Operações relacionadas a utilizadores
- `dataService.js`: Acesso a dados específicos da aplicação

## Exemplo de uso

Definição de um serviço:

```javascript
// services/authService.js
const API_URL = 'http://localhost:8000/api';

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Erro de login:', error);
    throw error;
  }
};
```

Uso em um componente:

```jsx
import { login } from '../services/authService';

function LoginForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      // Redirecionar após login bem-sucedido
    } catch (error) {
      // Mostrar mensagem de erro
    }
  };
  
  // Resto do componente...
}
```

## Boas práticas

- Centralizar a configuração da API num único lugar
- Utilizar tratamento de erros consistente !!!! Vai ajudar MUITO!
- Incluir gestão de tokens e autenticação
- Evitar chamadas diretas à API em componentes