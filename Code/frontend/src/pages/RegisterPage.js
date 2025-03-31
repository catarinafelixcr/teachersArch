import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png'; // ícone da seta

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="register-page" 
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            /*height: "100vh",*/
          }}
    >
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
        <input type="text" id="fullname" placeholder="Teacher's name" />

        <label htmlFor="email">School’s email</label>
        <input type="email" id="email" placeholder="username@gmail.com" />
        
        <label htmlFor="teacherid">Teacher’s ID</label>
        <input type="text" id="teacherid" placeholder="Teacher's institution ID" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" />

        <label htmlFor="confirmPassword">Verify password</label>
        <input type="password" id="confirmPassword" placeholder="Password" />

        <button className="register-button">Register Now</button>
      </div>
    </div>
  );
}

export default RegisterPage;
