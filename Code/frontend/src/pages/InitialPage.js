import React, { useEffect, useState } from 'react'; 
import '../styles/InitialPage.css';
import background from '../assets/background-dei.jpg';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

function InitialPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('Teacher');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    fetch('http://localhost:8000/api/profile/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized or fetch error');
      return res.json();
    })
    .then(data => {
      if (data.name) {
        const first = data.name.split(' ')[0];
        setFirstName(first);
      }
    })
    .catch(err => {
      console.error('Failed to fetch profile:', err);
    });
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content" style={{ backgroundImage: `url(${background})` }}>
        <div className="blue-overlay"></div>

        {/* HEADER removido — logo já está na sidebar */}

        <div className="center-wrapper">
          <div className="welcome-text">
            Hi, {firstName}!
          </div>

          <div className="insert-link-wrapper">
            <button className="insert-link-button" onClick={() => navigate('/insertlink')}>
              Insert Repository
            </button>
          </div>

          <div className="card-container">
            <div className="dashboard-card" onClick={() => navigate('/gradepredictions')}>
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
    </div>
  );
}

export default InitialPage;
