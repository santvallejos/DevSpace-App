import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5250/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;