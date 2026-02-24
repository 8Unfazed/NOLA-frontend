import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { professionAPI } from '../services/api';
import '../styles/Auth.css';

const DeveloperSignup = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  const [professions, setProfessions] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    profession: '',
    profile_picture: '',
    github_account: '',
    linkedin_account: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const response = await professionAPI.getAllProfessions();
      setProfessions(response.data.professions || []);
    } catch (error) {
      console.error('Error fetching professions:', error);
      // Fallback to default professions if API fails
      setProfessions([
        { id: 1, name: 'Software Developer' },
        { id: 2, name: 'Data Analyst' }
      ]);
    }
  };

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
      setFormData(prev => ({
        ...prev,
        profile_picture: file.name
      }));
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.profession || !formData.profile_picture || !formData.password) {
      setFormError('Email, Username, Profession, Profile Picture, and Password are required');
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
      role: 'developer',
      email: formData.email,
      username: formData.username,
      profession: formData.profession,
      profile_picture: formData.profile_picture,
      github_account: formData.github_account || undefined,
      linkedin_account: formData.linkedin_account || undefined,
      password: formData.password
    };

    const result = await signup(signupData);
    
    if (result.success) {
      navigate('/developer-dashboard');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Developer Registration</h2>
        
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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <select
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
            >
              <option value="">Select a profession</option>
              {professions.map(prof => (
                <option key={prof.id} value={prof.name}>
                  {prof.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profile_picture">Profile Picture</label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              onChange={handleFileChange}
              accept="image/*"
            />
            {formData.profile_picture && (
              <p className="file-selected">File selected: {formData.profile_picture}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="github_account">GitHub Account (Optional)</label>
            <input
              type="url"
              id="github_account"
              name="github_account"
              value={formData.github_account}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin_account">LinkedIn Account (Optional)</label>
            <input
              type="url"
              id="linkedin_account"
              name="linkedin_account"
              value={formData.linkedin_account}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
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
            {loading ? 'Registering...' : 'Register as Developer'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
          <p>Want to join as a business? <Link to="/signup/business">Sign up as Business</Link></p>
          <p>Are you an admin? <Link to="/signup/admin">Sign up as Admin</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSignup;
