import axios from 'axios';

// Create an axios instance with custom configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this URL to your backend address
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication services
export const AuthService = {
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  }
};

export default API;
