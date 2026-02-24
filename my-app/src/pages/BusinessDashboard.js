import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { clientAPI, developerAPI } from '../services/api';
import JobForm from '../components/JobForm';
import '../styles/Dashboard.css';

const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [businessProfile, setBusinessProfile] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [developerDetails, setDeveloperDetails] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchBusinessProfile();
    fetchJobs(); // Load jobs on mount
    if (activeTab === 'applicants') {
      fetchApplicants();
    } else if (activeTab === 'jobs') {
      fetchJobs();
    }
    // when applicants tab is active, poll for updates every 10s
    let pollId;
    if (activeTab === 'applicants') {
      pollId = setInterval(() => {
        fetchApplicants();
      }, 10000);
    }

    // when jobs tab active, poll for job updates
    let jobsPoll;
    if (activeTab === 'jobs') {
      jobsPoll = setInterval(() => {
        fetchJobs();
      }, 10000);
    }

    return () => {
      if (pollId) clearInterval(pollId);
      if (jobsPoll) clearInterval(jobsPoll);
    };
  }, [activeTab]);

  const fetchBusinessProfile = async () => {
    setLoading(true);
    try {
      const response = await clientAPI.getProfile(user?.id);
      setBusinessProfile(response.data);
      // Only set the business-specific fields for editing
      if (response.data.client_profile) {
        setEditData({
          business_name: response.data.client_profile.business_name || '',
          business_category: response.data.client_profile.business_category || '',
          business_description: response.data.client_profile.business_description || '',
          business_logo: response.data.client_profile.business_logo || ''
        });
      } else {
        setEditData({
          business_name: response.data.business_name || '',
          business_category: response.data.business_category || '',
          business_description: response.data.business_description || '',
          business_logo: response.data.business_logo || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await clientAPI.getApplicants(user?.id);
      // backend now returns { applicants_by_job: [...] }
      const data = response.data || {};
      console.log('GET /client/:id/applicants response:', data);
      setApplicants(data.applicants_by_job || []);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await clientAPI.getJobs();
      // Response can be array or object with jobs property
      const jobsList = Array.isArray(response.data) ? response.data : response.data.jobs || [];
      setJobs(jobsList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    setLoading(true);
    try {
      if (editingJob) {
        console.log('Updating job:', editingJob.id, jobData);
        const response = await clientAPI.updateJob(editingJob.id, jobData);
        console.log('Update response:', response);
        alert('Job updated successfully!');
      } else {
        console.log('Creating new job:', jobData);
        const response = await clientAPI.createJob(jobData);
        console.log('Create response:', response);
        alert('Job created successfully!');
      }
      setShowJobForm(false);
      setEditingJob(null);
      await fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0] || error.message || 'Unknown error';
      alert(`Error saving job: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setLoading(true);
      try {
        await clientAPI.deleteJob(jobId);
        alert('Job deleted successfully!');
        await fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job. Please try again.');
      } finally {
        setLoading(false);
      }
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
      // Only send the fields that should be updated
      const profileUpdate = {
        business_name: editData.business_name,
        business_category: editData.business_category,
        business_description: editData.business_description,
        business_logo: editData.business_logo
      };
      const response = await clientAPI.updateProfile(profileUpdate);
      setBusinessProfile({
        ...businessProfile,
        ...profileUpdate
      });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewDeveloperProfile = async (developerId) => {
    setLoading(true);
    try {
      const response = await developerAPI.getProfile(developerId);
      setDeveloperDetails(response.data);
      setSelectedDeveloper(developerId);
    } catch (error) {
      console.error('Error fetching developer details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">NOLA - Business Dashboard</div>
        <ul className="navbar-menu">
          <li><button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</button></li>
          <li><button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Personal Details</button></li>
          <li><button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>Manage Jobs</button></li>
          <li><button className={activeTab === 'applicants' ? 'active' : ''} onClick={() => setActiveTab('applicants')}>Available Applicants</button></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="dashboard-content">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="tab-content">
            <h2>Welcome to NOLA Business Dashboard</h2>
            <div className="welcome-card">
              <h3>Hello, {businessProfile?.client_profile?.business_name || businessProfile?.business_name || 'Business'}!</h3>
              <p>Welcome back to your dashboard. Here you can manage your business profile, create job postings, and find talented developers for your projects.</p>
              
              <div className="quick-stats">
                <div className="stat-card">
                  <h4>Job Postings</h4>
                  <p className="stat-number">{jobs.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Available Applicants</h4>
                  <p className="stat-number">{applicants.length}</p>
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
                  <label>Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    value={editData.business_name || ''}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Business Category *</label>
                  <input
                    type="text"
                    name="business_category"
                    value={editData.business_category || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. Tech Startup, Marketing Agency, E-commerce"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business Description</label>
                  <textarea
                    name="business_description"
                    value={editData.business_description || ''}
                    onChange={handleEditChange}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Business Logo</label>
                  <input
                    type="text"
                    name="business_logo"
                    value={editData.business_logo || ''}
                    onChange={handleEditChange}
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
                  <label>Business Name:</label>
                  <p>{businessProfile?.client_profile?.business_name || businessProfile?.business_name || 'Not specified'}</p>
                </div>

                <div className="profile-item">
                  <label>Business Category:</label>
                  <p>{businessProfile?.client_profile?.business_category || businessProfile?.business_category || 'Not specified'}</p>
                </div>

                <div className="profile-item">
                  <label>Business Description:</label>
                  <p>{businessProfile?.client_profile?.business_description || businessProfile?.business_description || 'Not specified'}</p>
                </div>

                <div className="profile-item">
                  <label>Business Logo:</label>
                  <p>{businessProfile?.client_profile?.business_logo || businessProfile?.business_logo || 'Not specified'}</p>
                </div>

                <div className="profile-item">
                  <label>Email:</label>
                  <p>{businessProfile?.email || 'Not specified'}</p>
                </div>

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
            <div className="jobs-header">
              <h2>Manage Job Postings</h2>
              {!showJobForm && (
                <button 
                  className="create-job-btn"
                  onClick={() => {
                    setEditingJob(null);
                    setShowJobForm(true);
                  }}
                >
                  + Create New Job
                </button>
              )}
            </div>

            {showJobForm ? (
              <>
                <h3>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h3>
                <JobForm
                  initialData={editingJob}
                  onSubmit={handleCreateJob}
                  isLoading={loading}
                  onCancel={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                  }}
                />
              </>
            ) : (
              <>
                {loading && <p>Loading jobs...</p>}
                {jobs.length === 0 ? (
                  <div className="empty-state">
                    <p>You haven't created any job postings yet.</p>
                    <button 
                      className="create-job-btn"
                      onClick={() => setShowJobForm(true)}
                    >
                      Create Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="jobs-list">
                    {jobs.map(job => (
                      <div key={job.id} className="job-list-item">
                        <div className="job-list-header">
                          <div className="job-list-title">
                            <h3>{job.title}</h3>
                            {job.position && <p className="position-label">{job.position}</p>}
                          </div>
                          <div className="job-list-status">
                            <span className={`status-badge status-${job.status}`}>{job.status}</span>
                          </div>
                        </div>

                        <div className="job-list-details">
                          {job.contract_type && (
                            <div className="detail-badge">
                              <strong>Contract:</strong> {job.contract_type}
                            </div>
                          )}
                          {job.location_type && (
                            <div className="detail-badge">
                              <strong>Location:</strong> {job.location_type}
                            </div>
                          )}
                          {job.hours_per_week && (
                            <div className="detail-badge">
                              <strong>Hours:</strong> {job.hours_per_week}/week
                            </div>
                          )}
                        </div>

                        {job.description && (
                          <p className="job-description">{job.description.substring(0, 150)}...</p>
                        )}

                        <div className="job-list-actions">
                          <button
                            className="edit-job-btn"
                            onClick={() => {
                              setEditingJob(job);
                              setShowJobForm(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-job-btn"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="tab-content">
            <h2>Available Applicants (Grouped by Job)</h2>
            {loading && <p>Loading applicants...</p>}

            {applicants.length === 0 ? (
              <p>No applicants available yet.</p>
            ) : (
              <div className="applicants-by-job">
                {applicants.map(job => (
                  <div key={`job-${job.id}`} className="job-applicants-section">
                    <div className="job-header">
                      <h3>{job.title}</h3>
                      <p className="job-meta">{job.position || ''} <span className={`status-badge status-${job.status}`}>{job.status}</span></p>
                    </div>

                    {/* Render assigned developer and list of applicants under each job */}
                    {((job.assigned_developer) || (job.applicants && job.applicants.length > 0) || (job.applicants_list && job.applicants_list.length > 0) || (job.developers && job.developers.length > 0)) ? (
                      <div className="applicants-list">
                        {/* show assigned developer first if present */}
                        {job.assigned_developer && (
                          <div className="applicant-card assigned-developer-card">
                            <div className="applicant-top">
                              {job.assigned_developer.developer_profile?.profile_picture && (
                                <img src={job.assigned_developer.developer_profile.profile_picture} alt={job.assigned_developer.first_name} className="profile-picture-small" />
                              )}
                              <div>
                                <p className="applicant-name">{job.assigned_developer.first_name} {job.assigned_developer.last_name || ''}</p>
                                <p className="applicant-meta">{job.assigned_developer.email}</p>
                              </div>
                            </div>
                            {job.assigned_developer.developer_profile && (
                              <div className="applicant-meta">{job.assigned_developer.developer_profile.skills || job.assigned_developer.developer_profile.description}</div>
                            )}
                            <div className="applicant-actions">
                              <button className="contact-btn" onClick={() => handleViewDeveloperProfile(job.assigned_developer.id)}>View Profile</button>
                            </div>
                          </div>
                        )}

                        {/* helper to pick the applicants array from possible response keys */}
                        {((job.applicants && job.applicants.length > 0) ? job.applicants : (job.applicants_list && job.applicants_list.length > 0) ? job.applicants_list : (job.developers && job.developers.length > 0) ? job.developers : []).map((dev) => (
                          <div key={dev.id} className="applicant-card">
                            <div className="applicant-top">
                              {dev.developer_profile?.profile_picture && (
                                <img src={dev.developer_profile.profile_picture} alt={dev.first_name} className="profile-picture-small" />
                              )}
                              <div>
                                <p className="applicant-name">{dev.first_name} {dev.last_name || ''}</p>
                                <p className="applicant-meta">{dev.email}</p>
                              </div>
                            </div>

                            {dev.developer_profile?.skills && (
                              <p className="applicant-meta">{dev.developer_profile.skills}</p>
                            )}

                            <div className="applicant-actions">
                              <button className="contact-btn" onClick={() => handleViewDeveloperProfile(dev.id)}>View Profile</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-assigned">
                        <p>No applicants available yet.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedDeveloper && developerDetails && (
              <div className="modal-overlay" onClick={() => setSelectedDeveloper(null)}>
                <div className="modal-content developer-profile-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="profile-header">
                    {developerDetails.developer_profile?.profile_picture && (
                      <img 
                        src={developerDetails.developer_profile.profile_picture} 
                        alt={developerDetails.first_name}
                        className="profile-picture"
                      />
                    )}
                    <div className="profile-header-info">
                      <h2>{developerDetails.first_name} {developerDetails.last_name || ''}</h2>
                      <p className="profile-email">{developerDetails.email}</p>
                    </div>
                  </div>

                  <div className="modal-body">
                    <div className="profile-section">
                      <h4>Professional Background</h4>
                      <p><strong>Years of Experience:</strong> {developerDetails.developer_profile?.years_of_experience || 0} years</p>
                      <p><strong>Available Time:</strong> {developerDetails.developer_profile?.available_time || 'Not specified'}</p>
                      <p><strong>Education Level:</strong> {developerDetails.developer_profile?.education_level || 'Not specified'}</p>
                    </div>

                    <div className="profile-section">
                      <h4>Skills & Description</h4>
                      <p><strong>Skills:</strong> {developerDetails.developer_profile?.skills || 'Not specified'}</p>
                      <p><strong>About:</strong> {developerDetails.developer_profile?.description || 'No description provided'}</p>
                    </div>

                    <div className="profile-section">
                      <h4>Performance Ratings</h4>
                      <div className="points-display">
                        <div className="point-card proficiency">
                          <p className="point-label">Proficiency Points</p>
                          <p className="point-value">{developerDetails.developer_profile?.proficiency_points || 0}</p>
                          <p className="point-description">Expertise & Technical Skills</p>
                        </div>
                        <div className="point-card courtesy">
                          <p className="point-label">Courtesy Points</p>
                          <p className="point-value">{developerDetails.developer_profile?.courtesy_points || 0}</p>
                          <p className="point-description">Professionalism & Communication</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h4>Online Presence</h4>
                      <div className="social-links">
                        {developerDetails.email && (
                          <div className="social-item">
                            <strong>Email:</strong>
                            <a href={`mailto:${developerDetails.email}`}>{developerDetails.email}</a>
                          </div>
                        )}
                        {developerDetails.developer_profile?.github_account && (
                          <div className="social-item">
                            <strong>GitHub:</strong>
                            <a href={developerDetails.developer_profile.github_account} target="_blank" rel="noopener noreferrer">{developerDetails.developer_profile.github_account}</a>
                          </div>
                        )}
                        {developerDetails.developer_profile?.linkedin_account && (
                          <div className="social-item">
                            <strong>LinkedIn:</strong>
                            <a href={developerDetails.developer_profile.linkedin_account} target="_blank" rel="noopener noreferrer">{developerDetails.developer_profile.linkedin_account}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button
                      className="close-btn"
                      onClick={() => setSelectedDeveloper(null)}
                    >
                      Close Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
