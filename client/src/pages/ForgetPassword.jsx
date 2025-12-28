import React, { useState } from 'react';
import { HiOutlineMail, HiArrowLeft } from 'react-icons/hi';
import '../styles/ForgetPassword.scss'; // Using the shared Auth styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Reset link sent to:", email);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        {/* Back to Login Link */}
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

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <HiOutlineMail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          /* Success State Message */
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