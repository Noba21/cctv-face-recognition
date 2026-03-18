import axios from './axios';

export const reportsAPI = {
  generateRecognitionReport: async (id) => {
    const response = await axios.get(`/reports/recognition/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  generatePersonReport: async (id) => {
    const response = await axios.get(`/reports/person/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateCustomReport: async (data) => {
    const response = await axios.post('/reports/custom', data, {
      responseType: 'blob',
    });
    return response.data;
  }
};