import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, profile } from '../services/api';

interface User {
  id: number;
  business_name: string;
  user_type: 'supplier' | 'retailer';
  phone: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  error: string | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  businessName: string;
  email: string;
  phone: string;
  gstNumber: string;
  password: string;
  userType: 'SUPPLIER' | 'RETAILER';
  address?: string;
  panNumber?: string;
  annualTurnover?: number;
  yearsInBusiness?: number;
  businessType?: string;
  shopOwnership?: 'owned' | 'rented';
  bankAccountDetails?: boolean;
}

const initialState = {
  user: null,
  error: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {}
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    error: string | null;
    loading: boolean;
  }>({
    user: null,
    error: null,
    loading: true
  });

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, user: null, loading: false }));
        return;
      }

      const response = await profile.get();
      setState(prev => ({
        ...prev,
        user: response.data,
        loading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        user: null,
        loading: false
      }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const payload = {
        business_name: data.businessName,
        phone: data.phone,
        gst_number: data.gstNumber,
        address: data.address || '',
        user_type: data.userType.toLowerCase(),
        user: {
          email: data.email,
          password: data.password,
          username: data.email,
          first_name: data.businessName
        },
        retailer_profile: data.userType === 'RETAILER' ? {
          pan_number: data.panNumber,
          annual_turnover: data.annualTurnover,
          years_in_business: data.yearsInBusiness,
          business_type: data.businessType,
          shop_ownership: data.shopOwnership,
          existing_bank_account: data.bankAccountDetails
        } : null
      };

      const response = await auth.register(payload);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      setState(prev => ({
        ...prev,
        user: response.user,
        loading: false
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.detail || 
                          'Registration failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await auth.login({ email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      setState(prev => ({
        ...prev,
        user: response.user,
        loading: false
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Invalid credentials';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setState(prev => ({
        ...prev,
        user: null,
        error: null
      }));
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}