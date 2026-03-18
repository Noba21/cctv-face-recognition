import axios from './axios';

export const recognitionAPI = {
  recognizeImage: async (formData) => {
    const response = await axios.post('/recognize/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  recognizeVideo: async (formData) => {
    const response = await axios.post('/recognize/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds timeout for video processing
    });
    return response.data;
  },

  getHistory: async (params = {}) => {
    const response = await axios.get('/recognize/history', { params });
    return response.data;
  },

  getRecognitionDetail: async (id) => {
    const response = await axios.get(`/recognize/history/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get('/recognize/stats');
    return response.data;
  }
};