import api from '../api';

export const dues = {
  getAll: async () => {
    try {
      const response = await api.get('/dues/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dues:', error);
      throw error;
    }
  },

  create: async (data: {
    retailer: number;
    amount: number;
    description: string;
    purchase_date: string;
    due_date: string;
  }) => {
    try {
      const response = await api.post('/dues/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating due:', error);
      throw error;
    }
  },

  getSummary: async () => {
    try {
      const response = await api.get('/dues/summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching summary:', error);
      throw error;
    }
  }
};