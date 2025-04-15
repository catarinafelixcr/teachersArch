import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import {
  FaHome, FaChartLine, FaUserGraduate, FaUsers, FaDatabase,
  FaQuestionCircle, FaInfoCircle
} from 'react-icons/fa';
import logo from '../assets/logo-white.png';
import '../styles/Sidebar.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmAlert({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userToken');
            navigate('/login');
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };
  

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => navigate('/initialpage')}><FaHome /> Home</button>
        <button onClick={() => navigate('/gradepredictions')}><FaChartLine /> Prediction of Grades</button>
        <button onClick={() => navigate('/alunos-risco')}><FaUserGraduate /> Student at Risk</button>
        <button onClick={() => navigate('/performance-categoria')}><FaUsers /> Performance Forecast by Category</button>
        <button onClick={() => navigate('/insertrepository')}><FaDatabase /> Insert Repository</button>
      </nav>

      <div className="sidebar-extra">
        <button onClick={() => alert('Help page coming soon!')}><FaQuestionCircle /> Help</button>
        <button onClick={() => alert('About page coming soon!')}><FaInfoCircle /> About</button>
      </div>

      <div className="sidebar-footer">
        <div className="footer-setting">
          <FiSettings /> <span>Settings</span>
        </div>
        <div className="footer-user">
          <p>Nome</p>
          <span className="username">{localStorage.getItem('professorName') || 'Teacher'}</span>
          <FiLogOut
            className="logout-icon"
            onClick={handleLogout}
            title="Terminar sessão"
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
