import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Hardcode for debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For sending cookies with requests
});

export default api;
