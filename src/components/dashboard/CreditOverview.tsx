import React from 'react';
import { CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

interface CreditOverviewProps {
  creditLimit: number;
  availableCredit: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
}

export default function CreditOverview({ creditLimit, availableCredit, nextPayment }: CreditOverviewProps) {
  const utilizationPercentage = ((creditLimit - availableCredit) / creditLimit) * 100;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 mr-3" />
          <h3 className="text-xl font-semibold">Credit Overview</h3>
        </div>
        {utilizationPercentage > 80 && (
          <div className="flex items-center text-yellow-300">
            <AlertCircle className="h-5 w-5 mr-1" />
            <span className="text-sm">High Usage</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Credit Utilization</span>
            <span>{utilizationPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500 bg-white"
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-indigo-200 text-sm">Available Credit</p>
            <p className="text-2xl font-bold">₹{availableCredit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Total Credit Limit</p>
            <p className="text-2xl font-bold">₹{creditLimit.toLocaleString()}</p>
          </div>
        </div>

        {nextPayment && (
          <div className="pt-4 border-t border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Next Payment Due</p>
                <p className="text-lg font-semibold mt-1">₹{nextPayment.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-200 text-sm">Due Date</p>
                <p className="text-lg font-semibold mt-1">
                  {new Date(nextPayment.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}