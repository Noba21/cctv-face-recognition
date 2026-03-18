import axios from './axios';

export const personsAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get('/persons', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/persons/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await axios.post('/persons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`/persons/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/persons/${id}`);
    return response.data;
  },

  hardDelete: async (id) => {
    const response = await axios.delete(`/persons/${id}/hard-delete`);
    return response.data;
  },

  getRecognitions: async (id) => {
    const response = await axios.get(`/persons/${id}/recognitions`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get('/persons/stats');
    return response.data;
  }
};