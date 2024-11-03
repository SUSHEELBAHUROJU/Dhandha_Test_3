import api from '../api';

export const transactions = {
  getAll: async () => {
    try {
      const response = await api.get('/transactions/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data: {
    retailerId: string;
    amount: number;
    description: string;
    invoiceNumber?: string;
    dueDate: Date;
    invoiceFile?: File;
  }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await api.post('/transactions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/transactions/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/transactions/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/transactions/${id}/`);
    } catch (error) {
      throw error;
    }
  }
};