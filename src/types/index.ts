export interface User {
  id: number;
  email: string;
  role: 'supplier' | 'retailer' | 'admin';
}

export interface CreditStatus {
  id: number;
  retailer_id: number;
  credit_limit: number;
  available_credit: number;
  total_outstanding: number;
  last_updated: string;
}

export interface Transaction {
  id: number;
  supplier_id: number;
  retailer_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  due_date: string;
}

export interface Payment {
  id: number;
  transaction_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_date: string;
}