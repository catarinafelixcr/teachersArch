import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LoginPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('activated') === 'true') {
      setActivated(true);
      setTimeout(() => setActivated(false), 4000);
    }
  }, [location.search]);

  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true);
      setError("Too many failed login attempts. Please try again in 30 seconds.");
      setTimeout(() => {
        setLoginAttempts(0);
        setIsBlocked(false);
        setError('');
      }, 30000); // 30 segundos de bloqueio
    }
  }, [loginAttempts]);

  const handleLogin = async () => {
    if (isBlocked) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch("http://localhost:8000/auth/token/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        navigate('/initialpage'); // mudar para a tua página seguinte
      } else {
        setLoginAttempts(prev => prev + 1);
        setError("Email or password invalid");
      }
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      setError("Email or password invalid");
    }
    setLoading(false);
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      if (field === 'email') {
        passwordInputRef.current.focus();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="top-bar">
        <div className="logo-area">
          <img src={logo} alt="Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        <div className="nav-links">
          <a href="#">Help</a>
          <a href="#">About</a>
        </div>
      </header>

      <div className="login-box">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>Login</h2>

        {activated && (
          <div className="activation-success">
            ✅ Account successfully activated!
          </div>
        )}

        <label htmlFor="email">Email</label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            placeholder="username@gmail.com"
            ref={emailInputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'email')}
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            ref={passwordInputRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="toggle-password"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <span
          onClick={() => navigate('/forgotpassword')}
          className="forgot"
          style={{ cursor: 'pointer' }}
        >
          Forgot Password?
        </span>

        <button className="sign-in" onClick={handleLogin} disabled={loading || isBlocked}>
          {isBlocked ? 'Temporarily Blocked' : loading ? 'Signing in...' : 'Sign in'}
        </button>

        {error && <p className="error-message">{error}</p>}

        <p className="register-text">
          Don't have an account yet?{" "}
          <span onClick={() => navigate('/signup')}>
            Register for free
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
