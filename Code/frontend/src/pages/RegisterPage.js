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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) return 'Strong';
    return 'Medium';
  };

  const validate = () => {
    const newErrors = {};

    if (!fullname.trim()) newErrors.fullname = 'Full name is required.';
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!teacherid.trim()) newErrors.teacherid = 'Teacher ID is required.';
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Include at least one letter and one number.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, teacherid, password })
    });
    setLoading(false);

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
          <a href="/help">Help</a>
          <a href="/about">About</a>
        </div>
      </header>

      <div className="register-box">
        <button className="back-button" onClick={() => navigate('/')}> 
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>Register new account</h2>

        <label htmlFor="fullname">Full name</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="fullname"
            placeholder="Teacher's name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className={errors.fullname ? 'input-error' : (!errors.fullname && fullname) ? 'input-ok' : ''}
            style={{ paddingRight: '30px' }}
          />
          {!errors.fullname && fullname && <span className="check-icon">✅</span>}
        </div>
        {errors.fullname && <p className="error-text">{errors.fullname}</p>}

        <label htmlFor="email">School’s email</label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'input-error' : (!errors.email && email) ? 'input-ok' : ''}
            style={{ paddingRight: '30px' }}
          />
          {!errors.email && email && <span className="check-icon">✅</span>}
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label htmlFor="teacherid">Teacher’s ID</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="teacherid"
            placeholder="Teacher's institution ID"
            value={teacherid}
            onChange={(e) => setTeacherid(e.target.value)}
            className={errors.teacherid ? 'input-error' : (!errors.teacherid && teacherid) ? 'input-ok' : ''}
            style={{ paddingRight: '30px' }}
          />
          {!errors.teacherid && teacherid && <span className="check-icon">✅</span>}
        </div>
        {errors.teacherid && <p className="error-text">{errors.teacherid}</p>}

        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              setPasswordStrength(checkPasswordStrength(val));
            }}
            className={errors.password ? 'input-error' : (!errors.password && password) ? 'input-ok' : ''}
            style={{ paddingRight: '30px' }}
          />
          {!errors.password && password && <span className="check-icon">✅</span>}
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}
        {password && (
          <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
            Strength: {passwordStrength}
          </p>
        )}

        <label htmlFor="confirmPassword">Verify password</label>
        <div className="input-wrapper">
          <input
            type="password"
            id="confirmPassword"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'input-error' : (!errors.confirmPassword && confirmPassword) ? 'input-ok' : ''}
            style={{ paddingRight: '30px' }}
          />
          {!errors.confirmPassword && confirmPassword && <span className="check-icon">✅</span>}
        </div>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

        <button className="register-button" onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register Now'}
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;