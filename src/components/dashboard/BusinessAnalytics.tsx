import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnalyticsProps {
  transactionData: {
    date: string;
    amount: number;
  }[];
  creditUtilization: number;
  paymentHistory: {
    onTime: number;
    late: number;
  };
}

export default function BusinessAnalytics({ transactionData, creditUtilization, paymentHistory }: AnalyticsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600">Credit Utilization</p>
              <p className="text-2xl font-bold text-indigo-900">{creditUtilization}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">On-Time Payments</p>
              <p className="text-2xl font-bold text-green-900">{paymentHistory.onTime}</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Late Payments</p>
              <p className="text-2xl font-bold text-yellow-900">{paymentHistory.late}</p>
            </div>
            <ArrowDownRight className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}