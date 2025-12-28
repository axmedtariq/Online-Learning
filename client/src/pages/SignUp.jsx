import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import '../styles/signup.scss'; // We can share one SCSS file for Login and SignUp

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (formData.username.length < 3) newErrors.username = "Username must be 3+ characters";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted Successfully", formData);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start your 7-day free trial today</p>
        </div>

        <button className="btn-social">
          <FcGoogle size={22} />
          <span>Sign up with Google</span>
        </button>

        <div className="auth-divider">
          <span>Or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="johndoe"
              className={errors.username ? 'input-error' : ''}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            {errors.username && <p className="error-message">{errors.username}</p>}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="hello@example.com"
              className={errors.email ? 'input-error' : ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary">
            Create My Account
          </button>
        </form>

        <p className="auth-redirect">
          Already a member? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;