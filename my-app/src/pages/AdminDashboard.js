import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [developers, setDevelopers] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [pointsData, setPointsData] = useState({ proficiency: 0, courtesy: 0 });

  useEffect(() => {
    if (activeTab === 'developers') {
      fetchDevelopers();
    } else if (activeTab === 'clients') {
      fetchClients();
    } else if (activeTab === 'rankings') {
      fetchDevelopers();
    }
  }, [activeTab]);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDevelopers();
      setDevelopers(response.data.developers || []);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getClients();
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDeveloper = async (jobId, developerId) => {
    try {
      await adminAPI.assignDeveloper(jobId, developerId);
      // Show success message
      alert('Developer assigned successfully!');
      if (activeTab === 'developers') {
        fetchDevelopers();
      }
    } catch (error) {
      console.error('Error assigning developer:', error);
      alert('Error assigning developer');
    }
  };

  const handleAddJobToClient = async (developerId, clientId) => {
    try {
      await adminAPI.addJobToClient(developerId, clientId);
      // Show success message
      alert('Developer added to client page successfully!');
    } catch (error) {
      console.error('Error adding job to client:', error);
      alert('Error adding job to client');
    }
  };

  const handleSearchDevelopers = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = developers.filter(dev =>
      dev.first_name.toLowerCase().includes(query) ||
      dev.email.toLowerCase().includes(query)
    );
    setFilteredDevelopers(filtered);
  };

  const handleAddPoints = async (developerId) => {
    try {
      await adminAPI.addDeveloperPoints(
        developerId,
        parseInt(pointsData.proficiency) || 0,
        parseInt(pointsData.courtesy) || 0
      );
      alert('Points added successfully!');
      setPointsModalOpen(false);
      setPointsData({ proficiency: 0, courtesy: 0 });
      fetchDevelopers();
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Error adding points');
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Group developers by profession
  const groupDevelopersByProfession = () => {
    const grouped = {};
    developers.forEach(dev => {
      const profession = dev.developer_profile?.profession || 'Not Specified';
      if (!grouped[profession]) {
        grouped[profession] = [];
      }
      grouped[profession].push(dev);
    });
    return grouped;
  };

  // Group clients by business category
  const groupClientsByCategory = () => {
    const grouped = {};
    clients.forEach(client => {
      const category = client.client_profile?.business_category || 'Not Specified';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(client);
    });
    return grouped;
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">NOLA - Admin Dashboard</div>
        <ul className="navbar-menu">
          <li><button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</button></li>
          <li><button className={activeTab === 'developers' ? 'active' : ''} onClick={() => setActiveTab('developers')}>Manage Developers</button></li>
          <li><button className={activeTab === 'rankings' ? 'active' : ''} onClick={() => setActiveTab('rankings')}>Developer Rankings</button></li>
          <li><button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>Manage Businesses</button></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="dashboard-content">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="tab-content">
            <h2>Admin Dashboard</h2>
            <div className="welcome-card">
              <h3>Welcome, Admin!</h3>
              <p>Manage the platform by handling developers, businesses, and job assignments.</p>
              
              <div className="quick-stats">
                <div className="stat-card">
                  <h4>Total Developers</h4>
                  <p className="stat-number">{developers.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Businesses</h4>
                  <p className="stat-number">{clients.length}</p>
                </div>
              </div>

              <div className="admin-actions">
                <h3>Quick Actions</h3>
                <ul>
                  <li>✓ Add developers to business visibility pages</li>
                  <li>✓ Assign developers to job postings</li>
                  <li>✓ Monitor all registered users</li>
                  <li>✓ Manage platform content</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Developers Tab */}
        {activeTab === 'developers' && (
          <div className="tab-content">
            <h2>Manage Developers (Grouped by Profession)</h2>
            {loading && <p>Loading developers...</p>}

            {developers.length === 0 ? (
              <p>No developers registered yet.</p>
            ) : (
              Object.entries(groupDevelopersByProfession()).map(([profession, devs]) => (
                <div key={profession} className="profession-group">
                  <h3 className="profession-title">{profession}</h3>
                  <div className="users-grid">
                    {devs.map(dev => (
                      <div key={dev.id} className="user-card">
                        <h3>{dev.first_name}</h3>
                        <p><strong>Profession:</strong> {dev.developer_profile?.profession || 'Not specified'}</p>
                        <p><strong>Email:</strong> {dev.email}</p>
                        <p><strong>Registered:</strong> {new Date(dev.created_at).toLocaleDateString()}</p>
                        
                        {dev.developer_profile && (
                          <>
                            <p><strong>GitHub:</strong> {dev.developer_profile.github_account || 'Not provided'}</p>
                            <p><strong>LinkedIn:</strong> {dev.developer_profile.linkedin_account || 'Not provided'}</p>
                            <p><strong>Skills:</strong> {dev.developer_profile.skills || 'Not specified'}</p>
                          </>
                        )}

                        <div className="action-buttons">
                          <button 
                            className="assign-btn"
                            onClick={() => { setSelectedDeveloper(dev); fetchClients(); }}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {selectedDeveloper && (
              <div className="modal-overlay" onClick={() => setSelectedDeveloper(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Manage Developer: {selectedDeveloper.first_name}</h3>
                  <div className="modal-body">
                    <p>Select a client to make this developer visible to:</p>
                    <div className="client-selection">
                      {clients.map(client => (
                        <button
                          key={client.id}
                          className="selection-btn"
                          onClick={() => {
                            handleAddJobToClient(selectedDeveloper.id, client.id);
                            setSelectedDeveloper(null);
                          }}
                        >
                          {client.first_name} - {client.client_profile?.business_name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedDeveloper(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="tab-content">
            <h2>Manage Businesses (Grouped by Category)</h2>
            {loading && <p>Loading businesses...</p>}

            {clients.length === 0 ? (
              <p>No businesses registered yet.</p>
            ) : (
              Object.entries(groupClientsByCategory()).map(([category, businessList]) => (
                <div key={category} className="category-group">
                  <h3 className="category-title">{category}</h3>
                  <div className="users-grid">
                    {businessList.map(client => (
                      <div key={client.id} className="user-card">
                        <h3>{client.client_profile?.business_name}</h3>
                        <p><strong>Category:</strong> {client.client_profile?.business_category || 'Not specified'}</p>
                        <p><strong>Contact Person:</strong> {client.first_name}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <p><strong>Registered:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
                        
                        {client.client_profile && (
                          <p><strong>Description:</strong> {client.client_profile.business_description}</p>
                        )}

                        <div className="action-buttons">
                          <button 
                            className="assign-btn"
                            onClick={() => setSelectedClient(client)}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {selectedClient && (
              <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Manage Business: {selectedClient.client_profile?.business_name}</h3>
                  <div className="modal-body">
                    <p>Select a developer to add to this business's applicant list:</p>
                    <div className="developer-selection">
                      {developers.map(dev => (
                        <button
                          key={dev.id}
                          className="selection-btn"
                          onClick={() => {
                            handleAddJobToClient(dev.id, selectedClient.id);
                            setSelectedClient(null);
                          }}
                        >
                          {dev.first_name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedClient(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Developer Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="tab-content">
            <h2>Developer Rankings & Points Management</h2>
            
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearchDevelopers}
                className="search-input"
              />
            </div>

            {loading && <p>Loading developers...</p>}

            {(searchQuery ? filteredDevelopers : developers).length === 0 ? (
              <p>No developers found.</p>
            ) : (
              <div className="developers-ranking-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Experience (Years)</th>
                      <th>Proficiency Points</th>
                      <th>Courtesy Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchQuery ? filteredDevelopers : developers).map(dev => (
                      <tr key={dev.id}>
                        <td>{dev.first_name}</td>
                        <td>{dev.email}</td>
                        <td>{dev.developer_profile?.years_of_experience || 0}</td>
                        <td>{dev.developer_profile?.proficiency_points || 0}</td>
                        <td>{dev.developer_profile?.courtesy_points || 0}</td>
                        <td>
                          <button
                            className="manage-points-btn"
                            onClick={() => {
                              setSelectedDeveloper(dev);
                              setPointsModalOpen(true);
                            }}
                          >
                            Add Points
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pointsModalOpen && selectedDeveloper && (
              <div className="modal-overlay" onClick={() => setPointsModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Add Points to {selectedDeveloper.first_name}</h3>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Proficiency Points:</label>
                      <input
                        type="number"
                        value={pointsData.proficiency}
                        onChange={(e) => setPointsData({ ...pointsData, proficiency: e.target.value })}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Courtesy Points:</label>
                      <input
                        type="number"
                        value={pointsData.courtesy}
                        onChange={(e) => setPointsData({ ...pointsData, courtesy: e.target.value })}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="button-group">
                      <button
                        className="save-btn"
                        onClick={() => handleAddPoints(selectedDeveloper.id)}
                      >
                        Add Points
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setPointsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
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

export default AdminDashboard;
