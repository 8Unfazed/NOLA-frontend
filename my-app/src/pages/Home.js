import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { developerAPI } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [developerProfile, setDeveloperProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'developer') {
      fetchDeveloperProfile();
    }
  }, [isAuthenticated, user]);

  const fetchDeveloperProfile = async () => {
    setLoading(true);
    try {
      const response = await developerAPI.getProfile(user?.id);
      setDeveloperProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="nav-brand">NOLA</div>
        <div className="nav-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup/business" className="nav-link primary">Get Started</Link>
            </>
          ) : (
            <div className="nav-welcome-section">
              <span className="nav-welcome">Welcome, {user?.first_name}!</span>
              {user?.role === 'developer' && developerProfile?.developer_profile && (
                <div className="developer-points">
                  <span className="point-badge proficiency">👨‍💻 Proficiency: {developerProfile.developer_profile.proficiency_points || 0}</span>
                  <span className="point-badge courtesy">🤝 Courtesy: {developerProfile.developer_profile.courtesy_points || 0}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Connect Businesses with Talented Developers</h1>
        <p>NOLA is a platform that bridges the gap between businesses and developers</p>
        
        {!isAuthenticated && (
          <div className="hero-buttons">
            <Link to="/signup/business" className="btn btn-primary">Register as Business</Link>
            <Link to="/signup/developer" className="btn btn-secondary">Register as Developer</Link>
          </div>
        )}
      </section>

      <section className="features">
        <h2>Why Choose NOLA?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🚀 For Businesses</h3>
            <p>Find talented developers, manage projects, and grow your team efficiently</p>
          </div>
          <div className="feature-card">
            <h3>💼 For Developers</h3>
            <p>Discover exciting job opportunities and showcase your skills to businesses</p>
          </div>
          <div className="feature-card">
            <h3>👨‍💼 Admin Management</h3>
            <p>Manage the platform, connect developers and businesses, monitor growth</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 NOLA. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
