import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/api';

// Create the context
export const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser({ token });
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await AuthService.login(credentials);
      setCurrentUser({ token: response.token, ...response.user });
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
