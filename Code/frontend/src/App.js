import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import InitialPage from './pages/InitialPage';
import LayoutWithSideBar from './components/LayoutWithSideBar';
import InsertRepositoryPage from './pages/InsertRepositoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/initialpage" element={
            <LayoutWithSideBar>
              <InitialPage />
            </LayoutWithSideBar>
          }
        />
        <Route path="/insertrepository" element= {
            <LayoutWithSideBar>
              <InsertRepositoryPage />
            </LayoutWithSideBar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
