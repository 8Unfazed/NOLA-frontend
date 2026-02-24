import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { developerAPI } from '../services/api';
import '../styles/Dashboard.css';

const ImproveSkill = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [developerProfile, setDeveloperProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeveloperProfile();
  }, []);

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

  const profession = developerProfile?.developer_profile?.profession;

  const softwareDeveloperSkills = [
    {
      category: 'Frontend Development',
      skills: ['React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'JavaScript/TypeScript'],
      resources: [
        'Complete React Bootcamp on Udemy',
        'Frontend Masters - Advanced React',
        'MDN Web Docs - JavaScript Guide'
      ]
    },
    {
      category: 'Backend Development',
      skills: ['Node.js', 'Python', 'Java', 'Express.js', 'Django', 'Spring Boot'],
      resources: [
        'The Complete Node.js Developer Course',
        'Python for Everybody',
        'Java Programming Masterclass'
      ]
    },
    {
      category: 'Database Management',
      skills: ['SQL', 'MongoDB', 'PostgreSQL', 'Firebase', 'Redis'],
      resources: [
        'SQL Tutorial - W3Schools',
        'MongoDB University',
        'PostgreSQL Documentation'
      ]
    },
    {
      category: 'DevOps & Cloud',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD'],
      resources: [
        'Docker Complete Guide',
        'Kubernetes for Developers',
        'AWS Certified Developer Guide'
      ]
    }
  ];

  const dataAnalystSkills = [
    {
      category: 'Data Analysis Tools',
      skills: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Google Analytics'],
      resources: [
        'Advanced Excel for Data Analysis',
        'SQL for Data Analysis Course',
        'Tableau Public Tutorials'
      ]
    },
    {
      category: 'Programming',
      skills: ['Python', 'R', 'Pandas', 'NumPy', 'Matplotlib'],
      resources: [
        'Python for Data Analysis',
        'R Programming Masterclass',
        'Data Science with Python - Coursera'
      ]
    },
    {
      category: 'Statistical Analysis',
      skills: ['Descriptive Statistics', 'Inferential Statistics', 'A/B Testing', 'Regression Analysis'],
      resources: [
        'Statistics Fundamentals Course',
        'Khan Academy - Statistics & Probability',
        'Understanding A/B Testing'
      ]
    },
    {
      category: 'Data Visualization',
      skills: ['Tableau', 'Power BI', 'D3.js', 'Matplotlib', 'Dashboarding'],
      resources: [
        'Data Visualization with Tableau',
        'Power BI Desktop Tutorial',
        'D3.js - Data Visualization Mastery'
      ]
    }
  ];

  const skillGuide = profession === 'Software Developer' ? softwareDeveloperSkills : dataAnalystSkills;
  const professionTitle = profession ? `Improve Your Skills as a ${profession}` : 'Improve Your Skills';

  const handleBackToDashboard = () => {
    navigate('/developer-dashboard');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">NOLA - Improve Skills</div>
        <ul className="navbar-menu">
          <li><button onClick={handleBackToDashboard}>Back to Dashboard</button></li>
          <li><button onClick={logout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="dashboard-content">
        <div className="tab-content">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2>{professionTitle}</h2>
              <p className="subtitle">
                Personalized learning path for your professional growth
              </p>

              {!profession ? (
                <div className="warning-message">
                  <p>Please complete your profile with a profession to see personalized skill recommendations.</p>
                </div>
              ) : (
                <div className="skills-guide">
                  {skillGuide.map((section, index) => (
                    <div key={index} className="skill-section">
                      <h3>{section.category}</h3>
                      
                      <div className="skills-list">
                        <h4>Core Skills to Master:</h4>
                        <ul>
                          {section.skills.map((skill, skillIndex) => (
                            <li key={skillIndex} className="skill-item">
                              {skill}
                              <span className="skill-badge">Advanced</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="resources-list">
                        <h4>Recommended Learning Resources:</h4>
                        <ul>
                          {section.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="resource-item">
                              📚 {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                  <div className="progress-section">
                    <h3>Your Progress</h3>
                    <div className="progress-stats">
                      <div className="progress-card">
                        <h4>Current Skills Level</h4>
                        <p className="progress-value">Advanced</p>
                      </div>
                      <div className="progress-card">
                        <h4>Proficiency Points</h4>
                        <p className="progress-value">
                          {developerProfile?.developer_profile?.proficiency_points || 0}
                        </p>
                      </div>
                      <div className="progress-card">
                        <h4>Next Milestone</h4>
                        <p className="progress-value">Expert</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .skills-guide {
          margin-top: 30px;
        }

        .skill-section {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .skill-section h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }

        .skill-section h4 {
          color: #34495e;
          margin-top: 15px;
          margin-bottom: 10px;
        }

        .skills-list ul, .resources-list ul {
          list-style: none;
          padding: 0;
        }

        .skill-item {
          background: white;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-left: 4px solid #667eea;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 4px;
        }

        .skill-badge {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .resource-item {
          background: white;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-left: 4px solid #27ae60;
          border-radius: 4px;
          color: #2c3e50;
        }

        .progress-section {
          margin-top: 30px;
          padding: 20px;
          background: #f0f7ff;
          border-radius: 8px;
        }

        .progress-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .progress-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-card h4 {
          color: #34495e;
          margin: 0 0 10px 0;
        }

        .progress-value {
          color: #667eea;
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }

        .warning-message {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          padding: 15px;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default ImproveSkill;
