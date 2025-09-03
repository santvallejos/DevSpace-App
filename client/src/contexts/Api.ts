import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL2 || 'http://localhost:5250/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add dynamic MongoDB headers
api.interceptors.request.use((config) => {
  // Get MongoDB config from localStorage (persisted by Zustand)
  const mongoConfigStorage = localStorage.getItem('mongodb-config-storage');
  
  if (mongoConfigStorage) {
    try {
      const { state } = JSON.parse(mongoConfigStorage);
      const mongoConfig = state?.config;
      
      if (mongoConfig?.isEnabled && mongoConfig.connectionString?.trim()) {
        config.headers['X-MongoDB-Connection'] = mongoConfig.connectionString;
        
        if (mongoConfig.databaseName?.trim()) {
          config.headers['X-MongoDB-Database'] = mongoConfig.databaseName;
        }
      }
    } catch (error) {
      console.warn('Error parsing MongoDB config from localStorage:', error);
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle MongoDB connection errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400 && 
        error.response?.data?.includes?.('MongoDB') || 
        error.response?.data?.includes?.('connection')) {
      console.error('MongoDB connection error:', error.response.data);
      // You could dispatch a notification here
    }
    return Promise.reject(error);
  }
);

export default api;