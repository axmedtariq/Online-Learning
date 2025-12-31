import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios'; // 1. Import Axios
import { useNavigate } from 'react-router-dom'; // 2. Import Navigate
import '../styles/signup.scss'; 

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 3. Add loading state
  const [serverMsg, setServerMsg] = useState(''); // 4. Add server message state
  
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    if (formData.username.length < 3) newErrors.username = "Username must be 3+ characters";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Connect to Backend via Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');
    
    if (validate()) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
        
        // Success
        alert("Account Created Successfully!");
        navigate('/login'); // Send user to login page after signing up
        
      } catch (err) {
        // Error handling (e.g., User already exists)
        setServerMsg(err.response?.data?.msg || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start your learning journey today</p>
        </div>

        {/* 6. Display Server Error Messages */}
        {serverMsg && <div className="server-error-alert">{serverMsg}</div>}

        <button className="btn-social" type="button">
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
              required
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
              required
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
              required
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create My Account"}
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