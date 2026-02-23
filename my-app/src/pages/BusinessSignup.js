import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const BusinessSignup = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    business_name: '',
    business_category: '',
    business_description: '',
    business_logo: '',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, store file name. In production, upload to cloud storage
      setFormData(prev => ({
        ...prev,
        business_logo: file.name
      }));
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.fullname || !formData.business_name || 
        !formData.business_category || !formData.business_description || !formData.business_logo || !formData.password) {
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
      role: 'client',
      email: formData.email,
      fullname: formData.fullname,
      business_name: formData.business_name,
      business_category: formData.business_category,
      business_description: formData.business_description,
      business_logo: formData.business_logo,
      password: formData.password
    };

    const result = await signup(signupData);
    
    if (result.success) {
      navigate('/business-dashboard');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Business Registration</h2>
        
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
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_name">Business Name</label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Your Business Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_category">Business Category</label>
            <input
              type="text"
              id="business_category"
              name="business_category"
              value={formData.business_category}
              onChange={handleChange}
              placeholder="e.g. Tech Startup, Marketing Agency, E-commerce"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_description">Business Description</label>
            <textarea
              id="business_description"
              name="business_description"
              value={formData.business_description}
              onChange={handleChange}
              placeholder="Describe your business..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_logo">Business Logo</label>
            <input
              type="file"
              id="business_logo"
              name="business_logo"
              onChange={handleFileChange}
              accept="image/*"
            />
            {formData.business_logo && (
              <p className="file-selected">File selected: {formData.business_logo}</p>
            )}
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
            {loading ? 'Registering...' : 'Register as Business'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
          <p>Want to join as a developer? <Link to="/signup/developer">Sign up as Developer</Link></p>
          <p>Are you an admin? <Link to="/signup/admin">Sign up as Admin</Link></p>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;
