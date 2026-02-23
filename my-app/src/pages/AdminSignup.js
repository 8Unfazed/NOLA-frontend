import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.firstname || !formData.password) {
      setFormError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    const signupData = {
      role: 'admin',
      email: formData.email,
      firstname: formData.firstname,
      password: formData.password
    };

    const result = await signup(signupData);
    
    if (result.success) {
      navigate('/admin-dashboard');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Registration</h2>
        
        {(error || formError) && (
          <div className="error-message">{error || formError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Registering...' : 'Register as Admin'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
          <p>Want to join as a business? <Link to="/signup/business">Sign up as Business</Link></p>
          <p>Want to join as a developer? <Link to="/signup/developer">Sign up as Developer</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
