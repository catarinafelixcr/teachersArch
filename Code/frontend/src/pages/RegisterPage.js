import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';
import arrowIcon from '../assets/arrow-white.png';
import React, { useState, useRef } from 'react';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Input references
  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const teacherIdRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) return 'Strong';
    return 'Medium';
  };

  const validate = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = 'Full name is required.';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,}$/.test(fullname.trim())) {
      newErrors.fullname = 'Enter a valid name (letters only, no symbols).';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!teacherid.trim()) {
      newErrors.teacherid = 'Teacher ID is required.';
    } else if (!/^\d+$/.test(teacherid.trim())) {
      newErrors.teacherid = 'Teacher ID must be a number.';
    }

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
      setShowSuccessModal(true);
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  return (
    <div className="register-page" style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <header className="top-bar">
        <div className="logo-area">
          <Link to="/">
            <img src={logo} alt="Logo" style={{ cursor: 'pointer' }} />
          </Link>
        </div>
        <div className="nav-links">
          <a href="/help">Help</a>
          <a href="/about">About</a>
          <a href="/login">Login</a>
          <a href="/">Homepage</a>
        </div>
      </header>

      <div className="register-box">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={arrowIcon} alt="Back" className="arrow-icon" />
        </button>

        <h2>Register new account</h2>

        <label htmlFor="fullname">Full name</label>
        <div className="input-wrapper">
          <input
            ref={fullnameRef}
            type="text"
            id="fullname"
            placeholder="Teacher's name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className={errors.fullname ? 'input-error' : (!errors.fullname && fullname) ? 'input-ok' : ''}
            onKeyDown={(e) => e.key === 'Enter' && emailRef.current.focus()}
          />
        </div>
        {errors.fullname && <p className="error-text">{errors.fullname}</p>}

        <label htmlFor="email">School’s email</label>
        <div className="input-wrapper">
          <input
            ref={emailRef}
            type="email"
            id="email"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'input-error' : (!errors.email && email) ? 'input-ok' : ''}
            onKeyDown={(e) => e.key === 'Enter' && teacherIdRef.current.focus()}
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        <label htmlFor="teacherid">Teacher’s ID</label>
        <div className="input-wrapper">
          <input
            ref={teacherIdRef}
            type="number"
            id="teacherid"
            placeholder="Teacher's institution ID"
            value={teacherid}
            onChange={(e) => setTeacherid(e.target.value)}
            className={errors.teacherid ? 'input-error' : (!errors.teacherid && teacherid) ? 'input-ok' : ''}
            onKeyDown={(e) => e.key === 'Enter' && passwordRef.current.focus()}
          />
        </div>
        {errors.teacherid && <p className="error-text">{errors.teacherid}</p>}

        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <input
            ref={passwordRef}
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
            onKeyDown={(e) => e.key === 'Enter' && confirmPasswordRef.current.focus()}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
            {showPassword ? 'Hide' : 'Show'}
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
            ref={confirmPasswordRef}
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'input-error' : (!errors.confirmPassword && confirmPassword) ? 'input-ok' : ''}
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="toggle-password"
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

        <button className="register-button" onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register Now'}
        </button>
      </div>

      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-content">
            <h2>Account created successfully!</h2>
            <p>Please check your email to verify your account before logging in.</p>
            <button onClick={() => navigate('/login')}>LOGIN</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
