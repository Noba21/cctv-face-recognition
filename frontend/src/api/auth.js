import axios from './axios';

export const authAPI = {
  /**
   * Login user with username and password
   * @param {Object} credentials - { username, password }
   * @returns {Promise} - { token, admin }
   */
  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const response = await axios.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - User data
   */
  getProfile: async () => {
    try {
      const response = await axios.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} data - { full_name, email }
   * @returns {Promise} - Updated user data
   */
  updateProfile: async (data) => {
    try {
      const response = await axios.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update profile API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} data - { current_password, new_password }
   * @returns {Promise}
   */
  changePassword: async (data) => {
    try {
      const response = await axios.post('/auth/change-password', data);
      return response.data;
    } catch (error) {
      console.error('Change password API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Verify if token is valid
   * @returns {Promise} - { valid, admin }
   */
  verifyToken: async () => {
    try {
      const response = await axios.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Verify token API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise}
   */
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {Object} data - { token, new_password }
   * @returns {Promise}
   */
  resetPassword: async (data) => {
    try {
      const response = await axios.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - { access_token }
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });
      return response.data;
    } catch (error) {
      console.error('Refresh token API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get all active sessions for current user
   * @returns {Promise} - List of sessions
   */
  getSessions: async () => {
    try {
      const response = await axios.get('/auth/sessions');
      return response.data;
    } catch (error) {
      console.error('Get sessions API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Revoke a specific session
   * @param {number} sessionId - Session ID to revoke
   * @returns {Promise}
   */
  revokeSession: async (sessionId) => {
    try {
      const response = await axios.delete(`/auth/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Revoke session API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Revoke all sessions except current
   * @returns {Promise}
   */
  revokeAllSessions: async () => {
    try {
      const response = await axios.delete('/auth/sessions');
      return response.data;
    } catch (error) {
      console.error('Revoke all sessions API error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default authAPI;