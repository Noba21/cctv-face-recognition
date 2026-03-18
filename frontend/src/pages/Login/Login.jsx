import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Common/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Animated Scan Line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-1 bg-primary-500/30 blur-xl animate-scan"></div>
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-4">
            <FiCamera className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">CCTV Face Recognition</h1>
          <p className="text-secondary-400 mt-2">Security Control Room Access</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-secondary-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 bg-secondary-700 border rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.username 
                      ? 'border-accent-red focus:ring-accent-red/50' 
                      : 'border-secondary-600 focus:border-primary-500 focus:ring-primary-500/50'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-accent-red">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-secondary-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-secondary-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 bg-secondary-700 border rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-accent-red focus:ring-accent-red/50' 
                      : 'border-secondary-600 focus:border-primary-500 focus:ring-primary-500/50'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-accent-red">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-secondary-700 border-secondary-600 rounded text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-secondary-400">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <span>Access Control Room</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-secondary-700">
            <p className="text-sm text-secondary-400 text-center mb-4">
              Demo Credentials
            </p>
            <div className="bg-secondary-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-400">Username:</span>
                <span className="text-white font-mono">admin</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-secondary-400">Password:</span>
                <span className="text-white font-mono">Admin@123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-secondary-400 hover:text-white transition-colors text-sm flex items-center justify-center space-x-1"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;