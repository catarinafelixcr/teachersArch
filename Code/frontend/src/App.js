import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import InitialPage from './pages/InitialPage';
import InsertRepositoryPage from './pages/InsertRepositoryPage';
import ComparePredictions from './pages/ComparePredictions'; 
import GradePredictions from './pages/GradePredictions';
import LayoutWithSideBar from './components/LayoutWithSideBar';
import CompareGroups from './pages/CompareGroups'; 
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage';
import PrivateRoute from './components/PrivateRoute';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirmPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/initialpage" element={
          <PrivateRoute>
            <InitialPage />
          </PrivateRoute>
        } />

        <Route path="/insertrepository" element={
          <LayoutWithSideBar>
            <InsertRepositoryPage />
          </LayoutWithSideBar>
        } />
        <Route path="/gradepredictions" element={
          <LayoutWithSideBar>
            <GradePredictions />
          </LayoutWithSideBar>
        } />
        <Route path="/compare-predictions" element={
          <LayoutWithSideBar>
            <ComparePredictions />
          </LayoutWithSideBar>
        } />
        <Route path="/comparepredictions" element={
          <LayoutWithSideBar>
            <ComparePredictions />
          </LayoutWithSideBar>
        } />
        <Route path="/comparegroups" element={
          <LayoutWithSideBar>
            <CompareGroups />
          </LayoutWithSideBar>
        } />
      </Routes>
    </Router>
  );
}

export default App;
