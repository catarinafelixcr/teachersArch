# Styles

Esta pasta contém os ficheiros de estilo para a aplicação React. Por as coisas pretty.

## Função

Aqui são definidos os estilos CSS (nossa escolha), ou outros formatos de estilo conforme decidam usar, que determinam a aparência visual da aplicação. A centralização dos estilos ajuda a manter consistência visual em toda a aplicação.

## Estrutura típica

- têm o mesmo nome que os respetivos js, que estão na pasta 'page'... Assim sabemos sempre facilmente a que corresponde!

## Como utilizar

Para utilizar estilos globais, importe-os no ficheiro principal da aplicação:

```jsx
// src/index.js ou App.js
import './styles/index.css';
```

## Boas práticas

- Manter consistência na nomenclatura de classes !!!
- Utilizar variáveis CSS para cores, fontes e valores recorrentes
- Considerar a responsividade desde o início