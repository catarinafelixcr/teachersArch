import React from 'react';
import '../styles/ForgotPasswordPage.css';
import background from '../assets/background-dei.jpg';
import logo from '../assets/logo.png';

function ForgotPasswordPage() {
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
          <img src={logo} alt="Logo" />
        </div>
        <div className="nav-links">
          <a href="#">Help</a>
          <a href="#">About</a>
        </div>
      </header>

      <div className="forgot-box">
        <h2>Forgot password</h2>
        <p className="instruction">Please enter your email to reset the password</p>

        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="username@gmail.com" />

        <button className="reset-button">Reset Password</button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
