import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';

function RegisterPage() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [teacherid, setTeacherid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, teacherid, password })
    });

    if (response.ok) {
      alert('Registration successful!');
      navigate('/login');
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  return (
    <div className="register-page" style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <header className="top-bar">
        <div className="logo-area">
          <img src={logo} alt="Logo" />
        </div>
        <div className="nav-links">
          <a href="#">Help</a>
          <a href="#">About</a>
        </div>
      </header>

      <div className="register-box">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>Register new account</h2>

        <label htmlFor="fullname">Full name</label>
        <input type="text" id="fullname" placeholder="Teacher's name" value={fullname} onChange={(e) => setFullname(e.target.value)} />

        <label htmlFor="email">School’s email</label>
        <input type="email" id="email" placeholder="username@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="teacherid">Teacher’s ID</label>
        <input type="text" id="teacherid" placeholder="Teacher's institution ID" value={teacherid} onChange={(e) => setTeacherid(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label htmlFor="confirmPassword">Verify password</label>
        <input type="password" id="confirmPassword" placeholder="Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <button className="register-button" onClick={handleRegister}>Register Now</button>
      </div>
    </div>
  );
}

export default RegisterPage;
  