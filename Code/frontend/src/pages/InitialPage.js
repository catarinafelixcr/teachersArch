import React from 'react';
import '../styles/InitialPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';


function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />
  
      <div className="dashboard-page" style={{ backgroundImage: `url(${background})` }}>
        <div className="blue-overlay"></div>
  
        <header className="top-bar">
          <div className="logo-area">
            <img src={logo} alt="Logo" />
          </div>
          <div className="nav-links">
            <a href="#">Help</a>
            <a href="#">About</a>
          </div>
        </header>
  
        <div className="insert-link-wrapper">
          <button className="insert-link-button" onClick={() => navigate('/inserir-link')}>
            Insert Link
          </button>
        </div>
  
        <div className="card-container">
          <div className="dashboard-card" onClick={() => navigate('/previsao-notas')}>
            <h3>Prediction of Grades</h3>
            <p>Visualize the students' performance forecast based on the data.</p>
          </div>
  
          <div className="dashboard-card" onClick={() => navigate('/alunos-risco')}>
            <h3>Students at Risk</h3>
            <p>Identify which students are most at risk of failing.</p>
          </div>
  
          <div className="dashboard-card" onClick={() => navigate('/produtividade-grupos')}>
            <h3>Performance forecast by category</h3>
            <p>Compare productivity between work groups.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default HomeDashboard;
