import api from '../api';

export const retailers = {
  search: async (query: string) => {
    try {
      const response = await api.get(`/retailers/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/retailers/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get retailer error:', error);
      throw error;
    }
  }
};