import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { developerAPI, professionAPI } from '../services/api';
import '../styles/ProfessionContent.css';

const ProfessionContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [developerProfile, setDeveloperProfile] = useState(null);
  const [professionData, setProfessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exams');

  useEffect(() => {
    fetchDeveloperProfile();
  }, []);

  const fetchDeveloperProfile = async () => {
    setLoading(true);
    try {
      const response = await developerAPI.getProfile(user?.id);
      const devProfile = response.data;
      setDeveloperProfile(devProfile);
      
      if (devProfile?.developer_profile?.profession) {
        await fetchProfessionContent(devProfile.developer_profile.profession);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionContent = async (professionName) => {
    setLoading(true);
    try {
      // First, get all professions
      const professionsResponse = await professionAPI.getAllProfessions();
      const profession = professionsResponse.data.professions?.find(p => p.name === professionName);
      
      if (profession) {
        // Then get the specific profession with all its content
        const profResponse = await professionAPI.getProfession(profession.id);
        setProfessionData(profResponse.data);
      }
    } catch (error) {
      console.error('Error fetching profession content:', error);
      setProfessionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/developer-dashboard');
  };

  const profession = developerProfile?.developer_profile?.profession;

  return (
    <div className="profession-content-container">
      <nav className="navbar">
        <div className="navbar-brand">NOLA - {profession} Learning Path</div>
        <ul className="navbar-menu">
          <li><button onClick={handleBackToDashboard}>Back to Dashboard</button></li>
          <li><button onClick={logout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="content-wrapper">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : !profession ? (
          <div className="no-profession">
            <p>Please complete your profile with a profession.</p>
          </div>
        ) : !professionData || (
          !professionData.exam_links?.length && 
          !professionData.hackathons?.length && 
          !professionData.code_quizzes?.length
        ) ? (
          <div className="coming-soon">
            <h2>Coming Soon!</h2>
            <p>Learning resources for <strong>{profession}</strong> are being prepared.</p>
            <p>Check back later for exams, hackathons, and coding challenges.</p>
          </div>
        ) : (
          <>
            <div className="tabs">
              {professionData.exam_links?.length > 0 && (
                <button 
                  className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
                  onClick={() => setActiveTab('exams')}
                >
                  📚 Exams ({professionData.exam_links.length})
                </button>
              )}
              {professionData.hackathons?.length > 0 && (
                <button 
                  className={`tab-btn ${activeTab === 'hackathons' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hackathons')}
                >
                  🏆 Hackathons ({professionData.hackathons.length})
                </button>
              )}
              {professionData.code_quizzes?.length > 0 && (
                <button 
                  className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quizzes')}
                >
                  💻 Code Quizzes ({professionData.code_quizzes.length})
                </button>
              )}
            </div>

            {/* Exams Tab */}
            {activeTab === 'exams' && professionData.exam_links?.length > 0 && (
              <div className="tab-content">
                <h2>Exams & Certifications</h2>
                <p className="description">Test your knowledge with these certification exams</p>
                <div className="items-grid">
                  {professionData.exam_links.map(exam => (
                    <div key={exam.id} className="exam-card content-card">
                      <div className="card-header">
                        <h3>{exam.title}</h3>
                        <span className={`difficulty ${exam.difficulty_level}`}>
                          {exam.difficulty_level}
                        </span>
                      </div>
                      <p className="description">{exam.description}</p>
                      <a 
                        href={exam.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-btn"
                      >
                        Take Exam →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hackathons Tab */}
            {activeTab === 'hackathons' && professionData.hackathons?.length > 0 && (
              <div className="tab-content">
                <h2>Hackathons</h2>
                <p className="description">Compete and collaborate with other developers</p>
                <div className="items-grid">
                  {professionData.hackathons.map(hack => (
                    <div key={hack.id} className="hackathon-card content-card">
                      <div className="card-header">
                        <h3>{hack.title}</h3>
                        <span className="date">
                          {new Date(hack.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="description">{hack.description}</p>
                      <div className="details">
                        <p><strong>📍 Location:</strong> {hack.location}</p>
                        <p><strong>📅 Start:</strong> {new Date(hack.start_date).toLocaleString()}</p>
                        {hack.end_date && (
                          <p><strong>🏁 End:</strong> {new Date(hack.end_date).toLocaleString()}</p>
                        )}
                        {hack.prize_pool && (
                          <p><strong>🎁 Prize:</strong> {hack.prize_pool}</p>
                        )}
                      </div>
                      {hack.registration_link && (
                        <a 
                          href={hack.registration_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="action-btn"
                        >
                          Register Now →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Quizzes Tab */}
            {activeTab === 'quizzes' && professionData.code_quizzes?.length > 0 && (
              <div className="tab-content">
                <h2>Code Quizzes</h2>
                <p className="description">Practice your coding skills with interactive quizzes</p>
                <div className="items-grid">
                  {professionData.code_quizzes.map(quiz => (
                    <div key={quiz.id} className="quiz-card content-card">
                      <div className="card-header">
                        <h3>{quiz.title}</h3>
                        <span className={`difficulty ${quiz.difficulty_level}`}>
                          {quiz.difficulty_level}
                        </span>
                      </div>
                      <p className="description">{quiz.description}</p>
                      <div className="details">
                        <p><strong>⏱️ Duration:</strong> {quiz.estimated_time} minutes</p>
                      </div>
                      <a 
                        href={quiz.quiz_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-btn"
                      >
                        Start Quiz →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .loading {
          text-align: center;
          padding: 60px 20px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ProfessionContent;
