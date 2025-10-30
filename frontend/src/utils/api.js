import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Use environment variable

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For sending cookies with requests
});

// Request interceptor to add the authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); // Get token from localStorage
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
