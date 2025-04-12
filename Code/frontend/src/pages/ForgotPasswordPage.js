import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('If this email exists, password reset instructions have been sent.');
        setEmail('');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div
      className="forgot-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="top-bar">
        <div className="logo-area">
          <img
            src={logo}
            alt="Logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="nav-links">
          <a href="#">Help</a>
          <a href="#">About</a>
          <a href="/">Homepage</a>
        </div>
      </header>

      <div className="forgot-box">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>Forgot password</h2>
        <p className="instruction">Please enter your email to reset the password</p>

        <div className="input-column">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button
          className="reset-button"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;