import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/LoginPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';

function LoginPage() {
  const navigate = useNavigate();

  // Estado para email e password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/token/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        navigate('/initialpage'); // muda para a página que quiseres
      } else {
        setError(data.detail || "Login falhou");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="login-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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
        <input type="email" id="email" placeholder="username@gmail.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <span onClick={() => navigate('/forgotpassword')} className="forgot" style={{ cursor: 'pointer' }}>
          Forgot Password?
        </span>

        <button className="sign-in" onClick={handleLogin}>Sign in</button>

        {error && <p className="error-message">{error}</p>}

        <p className="register-text">
          Don't have an account yet?{" "}
          <span
            style={{ color: '#003465', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            Register for free
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
