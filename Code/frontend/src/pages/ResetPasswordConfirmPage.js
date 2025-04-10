import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <--- usa os parâmetros da rota
import '../styles/ResetPasswordConfirmPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';

function ResetPasswordConfirmPage() {
  const navigate = useNavigate();
  const { uid, token } = useParams(); // <--- obtém uid e token da URL

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) return 'Strong';
    return 'Medium';
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      setError('Include at least one letter and one number.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSetPassword = async () => {
    setError('');
    setMessage('');

    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/password-reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          token: token,
          new_password: newPassword
        }),
      });

      if (response.ok) {
        setMessage('Password has been successfully reset.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setError(data?.detail || 'An error occurred. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Try again later.');
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
        </div>
      </header>

      <div className="forgot-box">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>Set New Password</h2>
        <p className="instruction">Please enter and confirm your new password</p>

        <div className="input-column">
          <label htmlFor="new-password">New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                const val = e.target.value;
                setNewPassword(val);
                setPasswordStrength(checkPasswordStrength(val));
              }}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          {newPassword && (
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
              Strength: {passwordStrength}
            </p>
          )}

          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirm ? 'text' : 'password'}
              id="confirm-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </span>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button
          className="reset-button"
          onClick={handleSetPassword}
          disabled={loading}
        >
          {loading ? 'Setting...' : 'Set Password'}
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordConfirmPage;
