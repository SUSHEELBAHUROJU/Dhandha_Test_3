import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CreditOverview from '../components/dashboard/CreditOverview';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import BusinessAnalytics from '../components/dashboard/BusinessAnalytics';
import QuickActions from '../components/dashboard/QuickActions';
import { PlusCircle, Calendar, FileText } from 'lucide-react';
import NewTransactionModal from '../components/modals/NewTransactionModal';

// Mock data for demonstration
const mockTransactions = [
  {
    id: '1',
    date: '2024-03-10',
    description: 'Purchase from ABC Electronics',
    amount: 50000,
    status: 'completed',
    counterparty: 'ABC Electronics'
  },
  {
    id: '2',
    date: '2024-03-08',
    description: 'Inventory Restocking',
    amount: 75000,
    status: 'pending',
    counterparty: 'Global Distributors'
  },
  {
    id: '3',
    date: '2024-03-05',
    description: 'Mobile Accessories',
    amount: 25000,
    status: 'completed',
    counterparty: 'Tech Solutions'
  }
];

const mockAnalytics = {
  transactionData: [
    { date: '2024-02', amount: 150000 },
    { date: '2024-03', amount: 280000 },
    { date: '2024-04', amount: 220000 }
  ],
  creditUtilization: 65,
  paymentHistory: {
    onTime: 28,
    late: 2
  }
};

export default function RetailerDashboard() {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  const handleNewPurchase = () => {
    setIsNewTransactionModalOpen(true);
  };

  const handleSchedulePayment = () => {
    // Implement payment scheduling
  };

  const handleViewReport = () => {
    // Implement report viewing
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Retailer!</h1>
            <p className="text-gray-600">Here's your business overview</p>
          </div>
          <button
            onClick={handleNewPurchase}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-secondary-700"
          >
            New Purchase
          </button>
        </div>

        {/* Credit Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CreditOverview
              creditLimit={500000}
              availableCredit={175000}
              nextPayment={{
                amount: 50000,
                dueDate: '2024-03-25'
              }}
            />
          </div>
          <QuickActions
            onNewPurchase={handleNewPurchase}
            onSchedulePayment={handleSchedulePayment}
            onViewReport={handleViewReport}
          />
        </div>

        {/* Transaction History */}
        <TransactionHistory transactions={mockTransactions} />

        {/* Business Analytics */}
        <BusinessAnalytics {...mockAnalytics} />
      </div>

      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        onSuccess={() => {
          setIsNewTransactionModalOpen(false);
          // Refresh transactions
        }}
      />
    </DashboardLayout>
  );
}