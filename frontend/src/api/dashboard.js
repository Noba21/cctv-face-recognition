// 
import axios from './axios';

export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await axios.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default data structure
      return {
        total_persons: 0,
        active_persons: 0,
        recent_recognitions: 0,
        today_recognitions: 0,
        match_rate: 0,
        recent_activities: []
      };
    }
  },

  getRecognitionTrends: async (days = 7) => {
    try {
      const response = await axios.get('/dashboard/recognition-trends', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recognition trends:', error);
      return []; // Return empty array on error
    }
  },

  getTopMatches: async () => {
    try {
      const response = await axios.get('/dashboard/top-matches');
      return response.data;
    } catch (error) {
      console.error('Error fetching top matches:', error);
      return []; // Return empty array on error
    }
  },

  getRiskDistribution: async () => {
    try {
      const response = await axios.get('/dashboard/risk-distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching risk distribution:', error);
      return { low: 0, medium: 0, high: 0, critical: 0 }; // Return default data
    }
  },

  getSystemStatus: async () => {
    try {
      const response = await axios.get('/dashboard/system-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      return {
        database: 'unknown',
        storage: { total: 0, used: 0, free: 0, usage_percent: 0 },
        recent_errors: 0,
        timestamp: new Date().toISOString()
      };
    }
  }
};