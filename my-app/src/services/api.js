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
  addJobToClient: (developerId, clientId) =>
    api.post('/admin/add_job_to_client', { developer_id: developerId, client_id: clientId }),
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

export default api;
