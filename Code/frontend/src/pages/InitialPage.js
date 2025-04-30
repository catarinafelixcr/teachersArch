import React, { useEffect, useState } from 'react';
import '../styles/InitialPage.css';
import background from '../assets/background-dei.jpg';
import Sidebar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function InitialPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('Teacher');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log("No token found.");
      return;
    }

    console.log("Fetching profile...");

    api.get('/api/profile/')
      .then(res => {
        const data = res.data;
        console.log("Profile data received:", data);
        if (data.name) {
          const first = data.name.split(' ')[0];
          setFirstName(first);
          localStorage.setItem('professorName', first);
        } else {
          console.warn("No name found in profile response.");
        }
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
      });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('professorName');
    if (stored) {
      setFirstName(stored);
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content" style={{ backgroundImage: `url(${background})` }}>
        <div className="blue-overlay"></div>
        <div className="center-wrapper">
          <div className="welcome-text">Hi, {firstName}!</div>
          <div className="insert-link-wrapper">
            <button className="insert-link-button" onClick={() => navigate('/insertrepository')}>
              Insert Repository
            </button>
          </div>
          <div className="card-container">
            <div className="dashboard-card" onClick={() => navigate('/gradepredictions')}>
              <h3>Prediction of Grades</h3>
              <p>Visualize the students' performance forecast based on the data.</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/studentatrisk')}>
              <h3>Students at Risk</h3>
              <p>Identify which students are most at risk of failing.</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/performanceforecast')}>
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
