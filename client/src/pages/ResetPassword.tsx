import React, { useState } from 'react';
import { HiOutlineLockClosed, HiCheckCircle } from 'react-icons/hi';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Added useParams
import axios from 'axios';
import '../styles/ResetPassword.scss';

const ResetPassword = () => {
  const { token } = useParams(); // 2. Grab the token from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      // 3. Axios call to your Backend route
      // The endpoint is: /api/auth/reset-password/:token
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: password
      });

      if (response.status === 200) {
        setIsSuccess(true);
      }
    } catch (err) {
      // Handle expired or invalid tokens (OWASP Security)
      setError(err.response?.data?.msg || "Link expired or invalid. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card success-box">
          <div className="success-icon">
            <HiCheckCircle size={50} color="#22c55e" />
          </div>
          <h2>Success!</h2>
          <p>Your password has been updated successfully. You can now log in with your new credentials.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>New Password</h2>
          <p>Please enter and confirm your new strong password.</p>
        </div>

        {/* 4. Display Error Alert */}
        {error && <div className="error-alert-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>New Password</label>
            <div className="input-with-icon">
              <HiOutlineLockClosed className="icon" size={20} />
              <input 
                type="password" 
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <div className="input-with-icon">
              <HiOutlineLockClosed className="icon" size={20} />
              <input 
                type="password" 
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="error-text">Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;