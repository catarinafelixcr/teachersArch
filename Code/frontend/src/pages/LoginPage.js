import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 ADICIONADO
import '../styles/LoginPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';


function LoginPage() {
  const navigate = useNavigate(); // 👈 ADICIONADO

  return (
    <div className="login-page" 
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

      <div className="login-box">  
      <button className="back-button" onClick={() => navigate('/')}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button> 
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="username@gmail.com" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" />

        <a href="#" className="forgot">Forgot Password?</a>

        <button className="sign-in">Sign in</button>

        <p className="register-text">
            Don't have an account yet? <a href="#">Register for free</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
