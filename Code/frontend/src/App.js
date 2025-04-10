import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import InitialPage from './pages/InitialPage';
import InsertRepositoryPage from './pages/InsertRepositoryPage';
import ComparePredictions from './pages/ComparePredictions'; 
import GradePredictions from './components/GradePredictions';
import LayoutWithSideBar from './components/LayoutWithSideBar';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirmPage />} />

        <Route
          path="/initialpage"
          element={
            <LayoutWithSideBar>
              <InitialPage />
            </LayoutWithSideBar>
          }
        />
        <Route
          path="/insertrepository"
          element={
            <LayoutWithSideBar>
              <InsertRepositoryPage />
            </LayoutWithSideBar>
          }
        />
        <Route
          path="/gradepredictions"
          element={
            <LayoutWithSideBar>
              <GradePredictions />
            </LayoutWithSideBar>
          }
        />
        <Route
          path="/compare-predictions"
          element={
            <LayoutWithSideBar>
              <ComparePredictions />
            </LayoutWithSideBar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
