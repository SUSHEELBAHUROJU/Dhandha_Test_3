import api from '../api';

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login/', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/register/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout/');
      localStorage.removeItem('token');
    } catch (error) {
      throw error;
    }
  }
};