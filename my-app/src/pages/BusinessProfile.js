import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';
import '../styles/Dashboard.css';

const BusinessProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinessProfile();
  }, [id]);

  const fetchBusinessProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.getProfile(id);
      setBusinessProfile(response.data);
    } catch (err) {
      setError('Failed to load business profile. Please try again later.');
      console.error('Error fetching business profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading-container"><p>Loading business profile...</p></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={handleGoBack} className="back-btn">Go Back</button>
      </div>
    );
  }

  if (!businessProfile) {
    return (
      <div className="error-container">
        <p>Business profile not found.</p>
        <button onClick={handleGoBack} className="back-btn">Go Back</button>
      </div>
    );
  }

  return (
    <div className="business-profile-container">
      <nav className="navbar">
        <div className="navbar-brand">NOLA</div>
        <button onClick={handleGoBack} className="back-navigation-btn">Back</button>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          {businessProfile.business_logo && (
            <img 
              src={businessProfile.business_logo} 
              alt={businessProfile.business_name} 
              className="business-logo"
            />
          )}
          <div className="profile-header-info">
            <h1>{businessProfile.business_name || 'Business'}</h1>
            {businessProfile.user && (
              <p className="business-contact">Contact: {businessProfile.user.email}</p>
            )}
          </div>
        </div>

        <div className="profile-details">
          <section className="detail-section">
            <h2>About</h2>
            <p>{businessProfile.business_description || 'No description available'}</p>
          </section>

          {businessProfile.jobs && businessProfile.jobs.length > 0 && (
            <section className="detail-section">
              <h2>Posted Jobs</h2>
              <div className="business-jobs">
                {businessProfile.jobs.map(job => (
                  <div key={job.id} className="job-listing">
                    <h3>{job.title}</h3>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Status:</strong> <span className={`status-${job.status}`}>{job.status}</span></p>
                    <p><strong>Posted:</strong> {new Date(job.posted_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="detail-section">
            <h2>Details</h2>
            <div className="detail-grid">
              {businessProfile.user && (
                <>
                  <div className="detail-item">
                    <label>Contact Name:</label>
                    <p>{businessProfile.user.first_name} {businessProfile.user.last_name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <p>{businessProfile.user.email}</p>
                  </div>
                </>
              )}
              <div className="detail-item">
                <label>Member Since:</label>
                <p>{new Date(businessProfile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
