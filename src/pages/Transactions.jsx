import React from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, Calendar } from 'lucide-react';

const Transactions = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500 mt-1">Check your recent spending history.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
          <Plus size={18} />
          <span>Add New</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-100">
              <Filter size={14} />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-100">
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Netflix Subscription', cat: 'Entertainment', date: 'Apr 18, 2026', amount: -499.00, type: 'expense' },
                  { name: 'Salary Credit', cat: 'Income', date: 'Apr 17, 2026', amount: 45000.00, type: 'income' },
                  { name: 'Lunch at Cafe', cat: 'Food', date: 'Apr 16, 2026', amount: -350.00, type: 'expense' },
                  { name: 'Petrol', cat: 'Travel', date: 'Apr 15, 2026', amount: -1200.00, type: 'expense' },
                ].map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-800">{t.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                        {t.cat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.date}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                      {t.type === 'income' ? '+' : '-'}Rs. {Math.abs(t.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
