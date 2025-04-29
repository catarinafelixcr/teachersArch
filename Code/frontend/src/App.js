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
import PerformanceForecastPage from './pages/PerformanceForecastPage';
import StudentsAtRisk from './pages/StudentAtRisk';


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
        <Route path="/performanceforecast" element={<PerformanceForecastPage />} />
        <Route path="/studentatrisk" element={<StudentsAtRisk />} />

        <Route path="/initialpage" element={
          <PrivateRoute>
            <InitialPage />
          </PrivateRoute>
        } />

        <Route path="/insertrepository" element={
          <PrivateRoute>
            <LayoutWithSideBar>
              <InsertRepositoryPage />
            </LayoutWithSideBar>
          </PrivateRoute>
        } />

        <Route path="/gradepredictions" element={
          <PrivateRoute>
            <LayoutWithSideBar>
              <GradePredictions />
            </LayoutWithSideBar>
          </PrivateRoute>
        } />

        <Route path="/comparepredictions" element={
          <PrivateRoute>
            <LayoutWithSideBar>
              <ComparePredictions />
            </LayoutWithSideBar>
          </PrivateRoute>
        } />
        
        <Route path="/comparegroups" element={
          <PrivateRoute>
            <LayoutWithSideBar>
              <CompareGroups />
            </LayoutWithSideBar>
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
