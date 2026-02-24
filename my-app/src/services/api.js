import axios from 'axios';

const API_BASE_URL = 'http://localhost:5555';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/signup', data),
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
};

export const clientAPI = {
  getProfile: (clientId) => api.get(`/client_details/${clientId}`),
  updateProfile: (data) => api.patch('/client_details', data),
  getApplicants: (clientId) => api.get(`/client/${clientId}/applicants`), // Get developers visible to a client
  getJobs: () => api.get('/jobs'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (jobId, data) => api.patch(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
};

export const developerAPI = {
  getProfile: (developerId) => api.get(`/developer_details/${developerId}`),
  updateProfile: (data) => api.post('/developer_details', data),
  getJobs: () => api.get('/jobs'),
};

export const adminAPI = {
  getDevelopers: () => api.get('/admin/developers'),
  getClients: () => api.get('/admin/clients'),
  assignDeveloper: (jobId, developerId) => 
    api.post('/admin/assign_developer', { job_id: jobId, developer_id: developerId }),
  addDeveloperPoints: (developerId, proficiencyPoints, courtesyPoints) =>
    api.post('/admin/developer_points', { 
      developer_id: developerId, 
      proficiency_points: proficiencyPoints,
      courtesy_points: courtesyPoints
    }),
};

export const jobAPI = {
  getJobs: () => api.get('/jobs'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (jobId, data) => api.patch(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
};

export const professionAPI = {
  // Professions
  getAllProfessions: () => api.get('/professions'),
  getProfession: (professionId) => api.get(`/professions/${professionId}`),
  createProfession: (data) => api.post('/professions', data),
  updateProfession: (professionId, data) => api.put(`/professions/${professionId}`, data),
  deleteProfession: (professionId) => api.delete(`/professions/${professionId}`),

  // Exam Links
  addExamLink: (professionId, data) => api.post(`/professions/${professionId}/exam_links`, data),
  updateExamLink: (professionId, examId, data) => api.put(`/professions/${professionId}/exam_links/${examId}`, data),
  deleteExamLink: (professionId, examId) => api.delete(`/professions/${professionId}/exam_links/${examId}`),

  // Hackathons
  addHackathon: (professionId, data) => api.post(`/professions/${professionId}/hackathons`, data),
  updateHackathon: (professionId, hackathonId, data) => api.put(`/professions/${professionId}/hackathons/${hackathonId}`, data),
  deleteHackathon: (professionId, hackathonId) => api.delete(`/professions/${professionId}/hackathons/${hackathonId}`),

  // Code Quizzes
  addCodeQuiz: (professionId, data) => api.post(`/professions/${professionId}/code_quizzes`, data),
  updateCodeQuiz: (professionId, quizId, data) => api.put(`/professions/${professionId}/code_quizzes/${quizId}`, data),
  deleteCodeQuiz: (professionId, quizId) => api.delete(`/professions/${professionId}/code_quizzes/${quizId}`),
};

export default api;
