# Assets

Esta pasta contém recursos estáticos utilizados pela aplicação React.

## Conteúdo típico

- Imagens (o que temos é isto)
- Ícones
- Fontes
- Outros recursos multimédia

## Como utilizar

Para utilizar um recurso nesta pasta em um componente React:

```jsx
import logo from '../assets/logo.png';

function Header() {
  return (
    <header>
      <img src={logo} alt="Logo" />
    </header>
  );
}
```

## Notas importantes

- Os ficheiros aqui serão processados pelo webpack durante a compilação.