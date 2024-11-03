import React from 'react';
import { Wallet, Calendar, Users, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight, Phone } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalOutstanding: number;
    dueToday: number;
    totalRetailers: number;
    overdueAmount: number;
    thisMonthCollection: number;
    lastMonthCollection: number;
  };
  isLoading: boolean;
}

export default function DashboardStats({ stats = {
  totalOutstanding: 0,
  dueToday: 0,
  totalRetailers: 0,
  overdueAmount: 0,
  thisMonthCollection: 0,
  lastMonthCollection: 0
}, isLoading }: DashboardStatsProps) {
  const collectionGrowth = stats.lastMonthCollection ? 
    ((stats.thisMonthCollection - stats.lastMonthCollection) / stats.lastMonthCollection) * 100 : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{stats.totalOutstanding?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Wallet className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">From {stats.totalRetailers || 0} retailers</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Due Today</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{stats.dueToday.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Follow up required</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              ₹{stats.overdueAmount.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Immediate action needed</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Retailers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRetailers}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Users className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Active business relations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month Collection</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{stats.thisMonthCollection.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          {collectionGrowth > 0 ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">
                {collectionGrowth.toFixed(1)}% from last month
              </span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">
                {Math.abs(collectionGrowth).toFixed(1)}% from last month
              </span>
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/90">Quick Actions</p>
            <p className="text-lg font-bold mt-1">Need Help?</p>
          </div>
          <div className="p-3 bg-white/10 rounded-full">
            <Phone className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <button className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            Send Bulk Reminders
          </button>
          <button className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            Download Statement
          </button>
        </div>
      </div>
      {/* Rest of the component remains the same */}
    </div>
  );
}