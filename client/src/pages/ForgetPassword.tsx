import React, { useState } from 'react';
import { HiOutlineMail, HiArrowLeft } from 'react-icons/hi';
import axios from 'axios'; // 1. Import Axios
import '../styles/ForgetPassword.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // 2. Add loading state
  const [error, setError] = useState(''); // 3. Add error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 4. Connect to your Backend route
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: email
      });

      if (response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (err) {
      // Handle cases where email doesn't exist or server is down
      setError(err.response?.data?.msg || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <a href="/login" className="back-link">
          <HiArrowLeft className="icon" /> Back to Login
        </a>

        {!isSubmitted ? (
          <>
            <div className="auth-header text-left">
              <h2>Forgot Password?</h2>
              <p>
                No worries! Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            {/* 5. Show Error Alert */}
            {error && <div className="error-alert-box">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <HiOutlineMail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon-circle">
              <HiOutlineMail size={40} />
            </div>
            <h2>Check your email</h2>
            <p>
              We've sent password reset instructions to <br />
              <strong>{email}</strong>
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="btn-text-link"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;