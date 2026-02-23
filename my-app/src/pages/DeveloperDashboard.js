import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { developerAPI } from '../services/api';
import JobDetail from '../components/JobDetail';
import '../styles/Dashboard.css';

const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [developerProfile, setDeveloperProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchDeveloperProfile();
    if (activeTab === 'jobs') {
      fetchAvailableJobs();
    }
  }, [activeTab]);

  const fetchDeveloperProfile = async () => {
    setLoading(true);
    try {
      const response = await developerAPI.getProfile(user?.id);
      setDeveloperProfile(response.data);
      setEditData(response.data.developer_profile || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableJobs = async () => {
    setLoading(true);
    try {
      const response = await developerAPI.getJobs();
      // backend now returns { jobs: [...], clients: [...] } for developers
      const data = response.data || {};
      setJobs(data.jobs || []);
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await developerAPI.updateProfile(editData);
      setEditMode(false);
      fetchDeveloperProfile();
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">NOLA - Developer Dashboard</div>
        <ul className="navbar-menu">
          <li><button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</button></li>
          <li><button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Personal Details</button></li>
          <li><button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>Available Jobs</button></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="dashboard-content">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="tab-content">
            <h2>Welcome to NOLA Developer Dashboard</h2>
            <div className="welcome-card">
              <h3>Hello, {developerProfile?.first_name || 'Developer'}!</h3>
              <p>Welcome back to your dashboard. Here you can manage your profile and explore available job opportunities.</p>
              
              <div className="quick-stats">
                <div className="stat-card">
                  <h4>Available Jobs</h4>
                  <p className="stat-number">{jobs.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Proficiency Points</h4>
                  <p className="stat-number">{developerProfile?.developer_profile?.proficiency_points || 0}</p>
                </div>
                <div className="stat-card">
                  <h4>Courtesy Points</h4>
                  <p className="stat-number">{developerProfile?.developer_profile?.courtesy_points || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Personal Details</h2>
            {loading && <p>Loading...</p>}
            
            {editMode ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Profession *</label>
                  <input
                    type="text"
                    name="profession"
                    value={editData.profession || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. Full Stack Developer, UI Designer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Profile Picture</label>
                  <input
                    type="text"
                    name="profile_picture"
                    value={editData.profile_picture || ''}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={editData.skills || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editData.description || ''}
                    onChange={handleEditChange}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Available Time</label>
                  <input
                    type="text"
                    name="available_time"
                    value={editData.available_time || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. Full-time, Part-time"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub Account</label>
                  <input
                    type="url"
                    name="github_account"
                    value={editData.github_account || ''}
                    onChange={handleEditChange}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn Account</label>
                  <input
                    type="url"
                    name="linkedin_account"
                    value={editData.linkedin_account || ''}
                    onChange={handleEditChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="form-group">
                  <label>Education Level</label>
                  <input
                    type="text"
                    name="education_level"
                    value={editData.education_level || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. Bachelor's, Master's"
                  />
                </div>

                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={editData.years_of_experience || 0}
                    onChange={handleEditChange}
                    placeholder="e.g. 5"
                    min="0"
                  />
                </div>

                <div className="button-group">
                  <button onClick={handleSaveProfile} disabled={loading} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={() => setEditMode(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <div className="profile-item">
                  <label>Username:</label>
                  <p>{developerProfile?.first_name}</p>
                </div>

                <div className="profile-item">
                  <label>Email:</label>
                  <p>{developerProfile?.email}</p>
                </div>

                {developerProfile?.developer_profile && (
                  <>
                    <div className="profile-item">
                      <label>Profession:</label>
                      <p>{developerProfile.developer_profile.profession || 'Not specified'}</p>
                    </div>

                    <div className="profile-item">
                      <label>Skills:</label>
                      <p>{developerProfile.developer_profile.skills || 'Not specified'}</p>
                    </div>

                    <div className="profile-item">
                      <label>Available Time:</label>
                      <p>{developerProfile.developer_profile.available_time || 'Not specified'}</p>
                    </div>

                    <div className="profile-item">
                      <label>GitHub:</label>
                      <p>{developerProfile.developer_profile.github_account || 'Not provided'}</p>
                    </div>

                    <div className="profile-item">
                      <label>LinkedIn:</label>
                      <p>{developerProfile.developer_profile.linkedin_account || 'Not provided'}</p>
                    </div>

                    <div className="profile-item">
                      <label>Years of Experience:</label>
                      <p>{developerProfile.developer_profile.years_of_experience || 0} years</p>
                    </div>
                  </>
                )}

                <button onClick={() => setEditMode(true)} className="edit-btn">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="tab-content">
            <h2>Available Jobs & Businesses</h2>
            {loading && <p>Loading jobs...</p>}

            {(jobs.length === 0 && clients.length === 0) ? (
              <p>No jobs available yet.</p>
            ) : (
              <div className="jobs-by-business">
                {/* Display jobs grouped by business */}
                {(() => {
                  // Group jobs by client_id
                  const jobsByBusiness = {};
                  jobs.forEach(job => {
                    const businessId = job.client?.id;
                    if (businessId) {
                      if (!jobsByBusiness[businessId]) {
                        jobsByBusiness[businessId] = {
                          business: job.client,
                          jobs: []
                        };
                      }
                      jobsByBusiness[businessId].jobs.push(job);
                    }
                  });

                  // Convert to array and render
                  return Object.entries(jobsByBusiness).map(([businessId, data]) => (
                    <div key={`business-${businessId}`} className="business-jobs-section">
                      <div className="business-header">
                        {data.business.business_logo && (
                          <img 
                            src={data.business.business_logo} 
                            alt={data.business.business_name}
                            className="business-logo-small"
                          />
                        )}
                        <div className="business-info">
                          <h3>{data.business.business_name || 'Business'}</h3>
                          <p className="business-category">{data.business.business_category || 'No category'}</p>
                        </div>
                        <button 
                          className="view-business-btn"
                          onClick={() => navigate(`/business-profile/${data.business.id}`)}
                        >
                          View Business
                        </button>
                      </div>

                      <div className="jobs-list">
                        {data.jobs.map(job => (
                          <div key={`job-${job.id}`} className="job-card-in-business">
                            <div className="job-card-title">
                              <h4>{job.title}</h4>
                              {job.position && <p className="job-position">{job.position}</p>}
                            </div>
                            
                            <div className="job-card-meta">
                              {job.contract_type && (
                                <span className="meta-badge">{job.contract_type}</span>
                              )}
                              {job.location_type && (
                                <span className="meta-badge">{job.location_type}</span>
                              )}
                              {job.hours_per_week && (
                                <span className="meta-badge">{job.hours_per_week}h/week</span>
                              )}
                              <span className={`status-badge status-${job.status}`}>{job.status}</span>
                            </div>

                            {job.description && (
                              <p className="job-description-preview">
                                {job.description.substring(0, 120)}...
                              </p>
                            )}

                            <div className="job-card-footer">
                              <button 
                                className="view-details-btn"
                                onClick={() => setSelectedJob(job)}
                              >
                                View Full Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}

                {/* Display standalone businesses with no jobs */}
                {clients.length > 0 && (
                  <div className="business-jobs-section">
                    <h3 className="section-title">Other Businesses</h3>
                    <div className="standalone-businesses">
                      {clients.map(client => (
                        <div key={`client-${client.id}`} className="business-card-standalone">
                          {client.business_logo && (
                            <img 
                              src={client.business_logo} 
                              alt={client.business_name}
                              className="business-logo-medium"
                            />
                          )}
                          <h4>{client.business_name || 'Business'}</h4>
                          <p className="business-category">{client.business_category || 'No category'}</p>
                          {client.business_description && (
                            <p className="business-description">{client.business_description.substring(0, 100)}...</p>
                          )}
                          <button 
                            className="view-business-btn-standalone"
                            onClick={() => navigate(`/business-profile/${client.id}`)}
                          >
                            View Business
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedJob && (
              <JobDetail 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperDashboard;
