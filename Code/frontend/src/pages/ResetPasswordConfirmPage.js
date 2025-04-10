import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPasswordConfirmPage.css';

function ResetPasswordConfirmPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/password/reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          token,
          new_password1: newPassword,
          new_password2: confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Password has been reset. You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await response.json();
        setError(data?.detail || 'An error occurred.');
      }
    } catch (err) {
      setError('Unable to connect to the server.');
    }

    setLoading(false);
  };

  return (
    <div className="reset-confirm-page">
      <div className="reset-box">
        <h2>Set New Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordConfirmPage;