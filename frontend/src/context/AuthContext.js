import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const userData = await authAPI.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, admin } = response;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(admin);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.admin);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      return { success: false };
    }
  };

  const changePassword = async (data) => {
    try {
      await authAPI.changePassword(data);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
      return { success: false };
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};