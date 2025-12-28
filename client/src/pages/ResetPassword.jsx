import React, { useState } from 'react';
import { HiOutlineLockClosed, HiCheckCircle } from 'react-icons/hi';
import '../styles/ResetPassword.scss';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && password.length >= 6) {
      console.log("Password updated successfully");
      setIsSuccess(true);
    } else {
      alert("Passwords do not match or are too short!");
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card success-box">
          <div className="success-icon">
            <HiCheckCircle size={50} />
          </div>
          <h2>Success!</h2>
          <p>Your password has been updated successfully. You can now log in with your new credentials.</p>
          <a href="/login" className="btn-primary">
            Back to Login
          </a>
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

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>New Password</label>
            <div className="input-with-icon">
              <HiOutlineLockClosed className="icon" size={20} />
              <input 
                type="password" 
                required
                placeholder="At least 6 characters"
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
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="error-text">Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;