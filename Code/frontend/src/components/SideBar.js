import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import {
  FaHome, FaChartLine, FaUserGraduate, FaUsers, FaDatabase,
  FaQuestionCircle, FaInfoCircle
} from 'react-icons/fa';
import logo from '../assets/logo-white.png';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

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
          <span className="username">nomeProfessor</span>
          <FiLogOut className="logout-icon" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;