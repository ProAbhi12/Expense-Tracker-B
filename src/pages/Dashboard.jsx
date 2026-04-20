import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Here is your summary.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
            View Reports
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-blue-600 p-6 rounded-xl text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <Wallet size={20} className="text-blue-100" />
          </div>
          <h3 className="text-3xl font-bold">Rs. 12,450.00</h3>
          <div className="mt-4 flex items-center text-blue-100 text-xs">
            <TrendingUp size={14} className="mr-1" />
            <span>+2.5% this month</span>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Monthly Income</p>
            <ArrowUpRight size={20} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Rs. 3,200.00</h3>
          <p className="text-green-600 text-xs font-medium mt-2">+Rs. 400 from last month</p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Monthly Expenses</p>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Rs. 1,150.00</h3>
          <p className="text-red-600 text-xs font-medium mt-2">-Rs. 120 from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-center">
          <CreditCard className="text-gray-400 mb-3" size={32} />
          <h4 className="font-bold text-gray-700">Spending Charts</h4>
          <p className="text-gray-500 text-sm mt-1">This section will be added by Member E.</p>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-center">
          <TrendingUp className="text-gray-400 mb-3" size={32} />
          <h4 className="font-bold text-gray-700">Recent Activity</h4>
          <p className="text-gray-500 text-sm mt-1">Transaction list highlights will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
