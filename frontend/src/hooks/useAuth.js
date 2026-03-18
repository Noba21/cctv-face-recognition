import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getProfile();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('token');
      setUser(null);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      localStorage.setItem('token', response.token);
      setUser(response.admin);
      setError(null);
      
      toast.success('Login successful!');
      navigate('/dashboard');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  }, [navigate]);

  const updateProfile = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(data);
      setUser(response.admin);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data) => {
    try {
      setLoading(true);
      await authAPI.changePassword(data);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to change password';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  }, [user]);

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAuthenticated,
    loadUser
  };
};

export default useAuth;