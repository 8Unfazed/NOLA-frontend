import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { professionAPI } from '../services/api';
import '../styles/AdminProfession.css';

const AdminProfessionManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [professions, setProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('professions');

  // Form states
  const [professionForm, setProfessionForm] = useState({ name: '', description: '' });
  const [examForm, setExamForm] = useState({ title: '', description: '', url: '', difficulty_level: 'intermediate' });
  const [hackathonForm, setHackathonForm] = useState({ 
    title: '', description: '', start_date: '', end_date: '', 
    registration_link: '', location: 'online', prize_pool: '' 
  });
  const [quizForm, setQuizForm] = useState({ 
    title: '', description: '', difficulty_level: 'intermediate', 
    quiz_url: '', estimated_time: 30 
  });

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    setLoading(true);
    try {
      const response = await professionAPI.getAllProfessions();
      setProfessions(response.data.professions || []);
    } catch (error) {
      console.error('Error fetching professions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfession = async (e) => {
    e.preventDefault();
    if (!professionForm.name.trim()) {
      alert('Profession name is required');
      return;
    }

    try {
      await professionAPI.createProfession(professionForm);
      setProfessionForm({ name: '', description: '' });
      fetchProfessions();
      alert('Profession added successfully!');
    } catch (error) {
      console.error('Error adding profession:', error);
      alert('Failed to add profession');
    }
  };

  const handleAddExamLink = async (e) => {
    e.preventDefault();
    if (!selectedProfession) {
      alert('Please select a profession first');
      return;
    }

    if (!examForm.title.trim() || !examForm.url.trim()) {
      alert('Title and URL are required');
      return;
    }

    try {
      await professionAPI.addExamLink(selectedProfession.id, examForm);
      setExamForm({ title: '', description: '', url: '', difficulty_level: 'intermediate' });
      const response = await professionAPI.getProfession(selectedProfession.id);
      setSelectedProfession(response.data.profession);
      alert('Exam link added successfully!');
    } catch (error) {
      console.error('Error adding exam link:', error);
      alert('Failed to add exam link');
    }
  };

  const handleDeleteExamLink = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam link?')) return;

    try {
      await professionAPI.deleteExamLink(selectedProfession.id, examId);
      const response = await professionAPI.getProfession(selectedProfession.id);
      setSelectedProfession(response.data.profession);
      alert('Exam link deleted successfully!');
    } catch (error) {
      console.error('Error deleting exam link:', error);
      alert('Failed to delete exam link');
    }
  };

  const handleAddHackathon = async (e) => {
    e.preventDefault();
    if (!selectedProfession) {
      alert('Please select a profession first');
      return;
    }

    if (!hackathonForm.title.trim() || !hackathonForm.start_date) {
      alert('Title and start date are required');
      return;
    }

    try {
      const formData = {
        ...hackathonForm,
        start_date: new Date(hackathonForm.start_date).toISOString(),
        end_date: hackathonForm.end_date ? new Date(hackathonForm.end_date).toISOString() : null
      };
      await professionAPI.addHackathon(selectedProfession.id, formData);
      setHackathonForm({ 
        title: '', description: '', start_date: '', end_date: '', 
        registration_link: '', location: 'online', prize_pool: '' 
      });
      const response = await professionAPI.getProfession(selectedProfession.id);
      setSelectedProfession(response.data.profession);
      alert('Hackathon added successfully!');
    } catch (error) {
      console.error('Error adding hackathon:', error);
      alert('Failed to add hackathon');
    }
  };

  const handleDeleteHackathon = async (hackathonId) => {
    if (!window.confirm('Are you sure you want to delete this hackathon?')) return;

    try {
      await professionAPI.deleteHackathon(selectedProfession.id, hackathonId);
      const response = await professionAPI.getProfession(selectedProfession.id);
      setSelectedProfession(response.data.profession);
      alert('Hackathon deleted successfully!');
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      alert('Failed to delete hackathon');
    }
  };

  const handleAddCodeQuiz = async (e) => {
    e.preventDefault();
    if (!selectedProfession) {
      alert('Please select a profession first');
      return;
    }

    if (!quizForm.title.trim() || !quizForm.quiz_url.trim()) {
      alert('Title and quiz URL are required');
      return;
    }

    try {
      await professionAPI.addCodeQuiz(selectedProfession.id, quizForm);
      setQuizForm({ 
        title: '', description: '', difficulty_level: 'intermediate', 
        quiz_url: '', estimated_time: 30 
      });
      const response = await professionAPI.getProfession(selectedProfession.id);
      setSelectedProfession(response.data.profession);
      alert('Code quiz added successfully!');
    } catch (error) {
      console.error('Error adding code quiz:', error);
      alert('Failed to add code quiz');
    }
  };

  const handleDeleteCodeQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this code quiz?')) return;

    try {
      await professionAPI.deleteCodeQuiz(selectedProfession.id, quizId);
      const response = await professionAPI.getProfession(selectedProfession.id);
      setSelectedProfession(response.data.profession);
      alert('Code quiz deleted successfully!');
    } catch (error) {
      console.error('Error deleting code quiz:', error);
      alert('Failed to delete code quiz');
    }
  };

  const handleSelectProfession = async (profession) => {
    try {
      const response = await professionAPI.getProfession(profession.id);
      setSelectedProfession(response.data.profession);
      setActiveTab('content');
    } catch (error) {
      console.error('Error fetching profession details:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-profession-container">
      <nav className="admin-navbar">
        <div className="navbar-brand">NOLA - Admin: Profession Management</div>
        <ul className="navbar-menu">
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </nav>

      <div className="admin-content">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'professions' ? 'active' : ''}`}
            onClick={() => setActiveTab('professions')}
          >
            Manage Professions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
            disabled={!selectedProfession}
          >
            Add Content {selectedProfession && `(${selectedProfession.name})`}
          </button>
        </div>

        {/* Professions Tab */}
        {activeTab === 'professions' && (
          <div className="tab-pane">
            <h2>Add New Profession</h2>
            <form className="profession-form" onSubmit={handleAddProfession}>
              <div className="form-group">
                <label>Profession Name *</label>
                <input
                  type="text"
                  value={professionForm.name}
                  onChange={(e) => setProfessionForm({ ...professionForm, name: e.target.value })}
                  placeholder="e.g., Software Engineering, Data Science"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={professionForm.description}
                  onChange={(e) => setProfessionForm({ ...professionForm, description: e.target.value })}
                  placeholder="Brief description of the profession"
                  rows="4"
                />
              </div>
              <button type="submit" className="submit-btn">Add Profession</button>
            </form>

            <h2>Existing Professions</h2>
            <div className="professions-list">
              {loading ? (
                <p>Loading...</p>
              ) : professions.length === 0 ? (
                <p className="empty-message">No professions added yet</p>
              ) : (
                professions.map(profession => (
                  <div key={profession.id} className="profession-card">
                    <h3>{profession.name}</h3>
                    <p>{profession.description || 'No description'}</p>
                    <button 
                      className="select-btn"
                      onClick={() => handleSelectProfession(profession)}
                    >
                      Manage Content
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && selectedProfession && (
          <div className="tab-pane">
            <h2>{selectedProfession.name}</h2>

            {/* Exam Links Section */}
            <div className="content-section">
              <h3>📚 Exam Links</h3>
              <form className="content-form" onSubmit={handleAddExamLink}>
                <div className="form-group">
                  <label>Exam Title *</label>
                  <input
                    type="text"
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    placeholder="e.g., Python Basics Test"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={examForm.description}
                    onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                    placeholder="Exam description"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Exam URL *</label>
                  <input
                    type="url"
                    value={examForm.url}
                    onChange={(e) => setExamForm({ ...examForm, url: e.target.value })}
                    placeholder="https://example.com/exam"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select 
                    value={examForm.difficulty_level}
                    onChange={(e) => setExamForm({ ...examForm, difficulty_level: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn">Add Exam Link</button>
              </form>

              <div className="items-list">
                {selectedProfession.exam_links && selectedProfession.exam_links.map(exam => (
                  <div key={exam.id} className="item-card">
                    <h4>{exam.title}</h4>
                    <p>{exam.description}</p>
                    <p><strong>Level:</strong> {exam.difficulty_level}</p>
                    <a href={exam.url} target="_blank" rel="noopener noreferrer">View Exam</a>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteExamLink(exam.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hackathons Section */}
            <div className="content-section">
              <h3>🏆 Hackathons</h3>
              <form className="content-form" onSubmit={handleAddHackathon}>
                <div className="form-group">
                  <label>Hackathon Title *</label>
                  <input
                    type="text"
                    value={hackathonForm.title}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, title: e.target.value })}
                    placeholder="e.g., Web Development Hackathon 2024"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={hackathonForm.description}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, description: e.target.value })}
                    placeholder="Hackathon description"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="datetime-local"
                    value={hackathonForm.start_date}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="datetime-local"
                    value={hackathonForm.end_date}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, end_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={hackathonForm.location}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, location: e.target.value })}
                    placeholder="e.g., Online, New York"
                  />
                </div>
                <div className="form-group">
                  <label>Registration Link</label>
                  <input
                    type="url"
                    value={hackathonForm.registration_link}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, registration_link: e.target.value })}
                    placeholder="https://example.com/register"
                  />
                </div>
                <div className="form-group">
                  <label>Prize Pool</label>
                  <input
                    type="text"
                    value={hackathonForm.prize_pool}
                    onChange={(e) => setHackathonForm({ ...hackathonForm, prize_pool: e.target.value })}
                    placeholder="e.g., $5000 + Internships"
                  />
                </div>
                <button type="submit" className="submit-btn">Add Hackathon</button>
              </form>

              <div className="items-list">
                {selectedProfession.hackathons && selectedProfession.hackathons.map(hack => (
                  <div key={hack.id} className="item-card">
                    <h4>{hack.title}</h4>
                    <p>{hack.description}</p>
                    <p><strong>When:</strong> {new Date(hack.start_date).toLocaleString()}</p>
                    <p><strong>Where:</strong> {hack.location}</p>
                    <p><strong>Prize:</strong> {hack.prize_pool || 'N/A'}</p>
                    {hack.registration_link && (
                      <a href={hack.registration_link} target="_blank" rel="noopener noreferrer">Register</a>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteHackathon(hack.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Quizzes Section */}
            <div className="content-section">
              <h3>💻 Code Quizzes</h3>
              <form className="content-form" onSubmit={handleAddCodeQuiz}>
                <div className="form-group">
                  <label>Quiz Title *</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="e.g., JavaScript Algorithms Quiz"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    placeholder="Quiz description"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Quiz URL *</label>
                  <input
                    type="url"
                    value={quizForm.quiz_url}
                    onChange={(e) => setQuizForm({ ...quizForm, quiz_url: e.target.value })}
                    placeholder="https://example.com/quiz"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select 
                    value={quizForm.difficulty_level}
                    onChange={(e) => setQuizForm({ ...quizForm, difficulty_level: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={quizForm.estimated_time}
                    onChange={(e) => setQuizForm({ ...quizForm, estimated_time: parseInt(e.target.value) })}
                    placeholder="30"
                    min="1"
                  />
                </div>
                <button type="submit" className="submit-btn">Add Code Quiz</button>
              </form>

              <div className="items-list">
                {selectedProfession.code_quizzes && selectedProfession.code_quizzes.map(quiz => (
                  <div key={quiz.id} className="item-card">
                    <h4>{quiz.title}</h4>
                    <p>{quiz.description}</p>
                    <p><strong>Level:</strong> {quiz.difficulty_level}</p>
                    <p><strong>Time:</strong> {quiz.estimated_time} minutes</p>
                    <a href={quiz.quiz_url} target="_blank" rel="noopener noreferrer">Start Quiz</a>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteCodeQuiz(quiz.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfessionManagement;
