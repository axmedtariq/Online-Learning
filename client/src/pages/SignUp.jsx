import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signup.scss';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState('');

  const navigate = useNavigate();

  // Client-side validation (CI-safe)
  const validate = () => {
    const newErrors = {};

    if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler (unused variable fixed)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');

    if (!validate()) return;

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/signup`, formData);

      alert('Account created successfully!');
      navigate('/login');
    } catch (error) {
      setServerMsg(
        error.response?.data?.msg ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start your learning journey today</p>
        </div>

        {serverMsg && (
          <div className="server-error-alert">{serverMsg}</div>
        )}

        <button type="button" className="btn-social">
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
              value={formData.username}
              className={errors.username ? 'input-error' : ''}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={formData.email}
              className={errors.email ? 'input-error' : ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              className={errors.password ? 'input-error' : ''}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
          </button>
        </form>

        <p className="auth-redirect">
          Already a member? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
