import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardStats from '../components/dashboard/DashboardStats';
import RetailerSearch from '../components/dashboard/RetailerSearch';
import DuesList from '../components/dashboard/DuesList';
import PaymentReminder from '../components/dashboard/PaymentReminder';
import AddDueModal from '../components/modals/AddDueModal';
import { dues } from '../services/api';

export default function SupplierDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duesData, setDuesData] = useState<any[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isAddDueModalOpen, setIsAddDueModalOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalOutstanding: 0,
    dueToday: 0,
    totalRetailers: 0,
    overdueAmount: 0,
    thisMonthCollection: 0,
    lastMonthCollection: 0
  });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [duesResponse, summaryResponse] = await Promise.all([
        dues.getAll(),
        dues.getSummary()
      ]);

      setDuesData(duesResponse || []);
      setDashboardStats({
        totalOutstanding: summaryResponse?.totalOutstanding || 0,
        dueToday: summaryResponse?.dueToday || 0,
        totalRetailers: summaryResponse?.totalRetailers || 0,
        overdueAmount: summaryResponse?.overdueAmount || 0,
        thisMonthCollection: summaryResponse?.thisMonthCollection || 0,
        lastMonthCollection: summaryResponse?.lastMonthCollection || 0
      });
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRetailerSelect = (retailer: any) => {
    setSelectedRetailer(retailer);
    setIsAddDueModalOpen(true);
  };

  const handleDueAdded = () => {
    fetchDashboardData();
    setIsAddDueModalOpen(false);
    setSelectedRetailer(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <DashboardStats stats={dashboardStats} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RetailerSearch onRetailerSelect={handleRetailerSelect} />
          <PaymentReminder 
            dues={duesData.filter(due => due.status === 'overdue')} 
            onUpdate={fetchDashboardData} 
          />
        </div>

        <DuesList dues={duesData} />

        <AddDueModal
          isOpen={isAddDueModalOpen}
          onClose={() => setIsAddDueModalOpen(false)}
          onSuccess={handleDueAdded}
          selectedRetailer={selectedRetailer}
        />
      </div>
    </DashboardLayout>
  );
}