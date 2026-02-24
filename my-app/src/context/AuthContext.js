import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    const ts = localStorage.getItem('login_timestamp');
    const now = Date.now();
    const TEN_MIN = 10 * 60 * 1000; // 10 minutes in ms

    if (storedUser && storedToken && ts) {
      const age = now - parseInt(ts, 10);
      if (age <= TEN_MIN) {
        // restore session
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // expired session window — clear stored auth
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('login_timestamp');
        setUser(null);
        setToken(null);
      }
    }
  }, []);

  const signup = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup(data);
      const { user: userData, access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('login_timestamp', Date.now().toString());
      
      setUser(userData);
      setToken(access_token);
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, access_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('login_timestamp', Date.now().toString());
      
      setUser(userData);
      setToken(access_token);
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('login_timestamp');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      signup, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
