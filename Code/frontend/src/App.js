import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import InitialPage from './pages/InitialPage';
import LayoutWithSidebar from './components/LayoutWithSideBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route
          path="/initialpage"
          element={
            <LayoutWithSidebar>
              <InitialPage />
            </LayoutWithSidebar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
