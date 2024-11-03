import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const transactions = {
  getAll: async () => {
    try {
      const response = await api.get('/transactions/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/transactions/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const retailers = {
  search: async (query: string) => {
    try {
      const response = await api.get(`/retailers/search/?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/retailers/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const dues = {
  create: async (data: any) => {
    try {
      const response = await api.post('/dues/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/dues/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSummary: async () => {
    try {
      const response = await api.get('/dues/summary/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};