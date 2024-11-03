import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login/', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/register/', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
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

export const transactions = {
  getAll: async () => {
    try {
      const response = await api.get('/transactions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  create: async (data: {
    retailerId: string;
    amount: number;
    description: string;
    dueDate: Date;
    invoiceNumber?: string;
    invoiceFile?: File;
  }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      
      const response = await api.post('/transactions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/transactions/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/transactions/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/transactions/${id}/`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};

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

export const profile = {
  get: async () => {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  update: async (data: any) => {
    try {
      const response = await api.put('/profile/', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default api;