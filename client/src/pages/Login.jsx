import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import '../styles/Login.scss'; // We will create this next

const Login = () => {
  return (
    <div className="login-page">
      {/* Login Card */}
      <div className="login-card">
        
        {/* Header */}
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Log in to continue your learning journey</p>
        </div>

        {/* Social Login Button */}
        <button className="btn-google">
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <div className="divider">
          <span className="divider-text">Or with Email</span>
        </div>

        {/* Form */}
        <form className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. name@example.com"
              required
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="/forgot-password">Forgot password?</a>
            </div>
            <input 
              type="password" 
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Log In
          </button>
        </form>

        {/* Footer Link */}
        <p className="signup-prompt">
          Don't have an account? <a href="/signup">Sign up for free</a>
        </p>
      </div>
    </div>
  );
};

export default Login;