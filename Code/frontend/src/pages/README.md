# Pages

Esta pasta contém componentes React que representam páginas completas da aplicação.

## Função

Ao contrário dos componentes genéricos em `components/`, os ficheiros nesta pasta representam algo para cada página da aplicação, cada ficheiro corresponde a uma rota específica na aplicação.

## Estrutura
Aqui tá algo mais gerak, para saberes especificamente as funcionalidades, precisas de ir à pasta onde estão os UCs e USs. (Em vez de \Code vai a \Requirements)

- `HomePage.jsx`: Página inicial da aplicação
- `LoginPage.jsx`: Página de login
- `DashboardPage.jsx`: Painel principal após login
- `ProfilePage.jsx`: Página de perfil do utilizador
- etc.

- `AboutPage.js`: Página com informações sobre nós.
- `CompareGroups.js`: Página para comparar grupos -- não foi usada na aplicação mas está funcional, só nos custou apagar :(.
- `ForgotPasswordPage.js`: Página para pedir recuperação da palavra-passe.
- `GradePredictions.js`: Página que mostra previsões de notas.
- `HomePage.js`: Página inicial da aplicação.
- `InitialPage.js`: Primeira página de introdução, antes do login ou registo.
- `InsertRepositoryPage.js`: Página para inserir e associar repositórios.
- `LoginPage.js`: Página de autenticação de utilizador.
- `PerformanceForecastPage.js`: Página que mostra a previsão por categorias das notas.
- `RegisterPage.js`: Página de registo de novos utilizadores.
- `ResetPasswordConfirmPage.js`: Página de confirmação para redefinir a palavra-passe.
- `StudentAtRisk.js`: Página que identifica estudantes (previsão).

## Como utilizar com React Router

Estas páginas são geralmente utilizadas em conjunto com o React Router:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```