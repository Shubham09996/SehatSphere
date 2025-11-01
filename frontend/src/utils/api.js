import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Explicitly set base URL for development

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For sending cookies with requests
});

// Request interceptor to add the authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); // Get token from localStorage
    console.log("API Interceptor: JWT token retrieved:", token); // NEW LOG
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
