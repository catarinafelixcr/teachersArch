import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const [loginAttemptsByEmail, setLoginAttemptsByEmail] = useState({});
  const [blockedEmails, setBlockedEmails] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('blockedEmails');
    if (stored) {
      const parsed = JSON.parse(stored);
      setBlockedEmails(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('blockedEmails', JSON.stringify(blockedEmails));
  }, [blockedEmails]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('activated') === 'true') {
      setActivated(true);
      setTimeout(() => setActivated(false), 4000);
    }
  }, [location.search]);

  const handleLogin = async () => {
    const now = Date.now();
    const unblockTime = blockedEmails[email];

    if (unblockTime && now < unblockTime) {
      setError("Too many failed login attempts. Please try again in 30 seconds.");
      return;
    }

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
        localStorage.setItem('userToken', 'true');
        navigate('/initialpage');
      } else {
        setLoginAttemptsByEmail(prev => {
          const attempts = prev[email] ? prev[email] + 1 : 1;

          if (attempts >= 5) {
            const blockUntil = Date.now() + 30000;
            setBlockedEmails(prev => ({
              ...prev,
              [email]: blockUntil
            }));

            // Limpa bloqueio após 30 segundos
            setTimeout(() => {
              setBlockedEmails(prev => {
                const updated = { ...prev };
                delete updated[email];
                return updated;
              });

              setLoginAttemptsByEmail(prev => {
                const updated = { ...prev };
                delete updated[email];
                return updated;
              });

              setError('');
            }, 30000);
          }

          return { ...prev, [email]: attempts };
        });

        setError("Email or password invalid");
      }
    } catch (err) {
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

  const isEmailBlocked = useMemo(() => {
    const unblockTime = blockedEmails[email];
    return unblockTime && Date.now() < unblockTime;
  }, [email, blockedEmails]);

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
          <a href="/about">About</a>
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

        <button
          className="sign-in"
          onClick={handleLogin}
          disabled={loading || isEmailBlocked}
        >
          {isEmailBlocked
            ? 'Temporarily Blocked'
            : loading
              ? 'Signing in...'
              : 'Sign in'}
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
