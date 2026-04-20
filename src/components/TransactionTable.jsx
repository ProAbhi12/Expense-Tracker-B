import React from 'react';

export default function TransactionTable({ transactions }) {
  const getTypeColor = (type) => {
    return type === "INCOME" 
      ? "bg-green-100 text-green-700" 
      : "bg-red-100 text-red-700";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Source</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Method</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 text-sm text-gray-600">
                {formatDate(tx.date)}
              </td>
              <td className="px-6 py-5 font-medium text-gray-800">
                {tx.name}
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-gray-700">{tx.category.name}</span>
              </td>
              <td className="px-6 py-5 text-sm text-gray-600">{tx.source}</td>
              <td className="px-6 py-5">
                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {tx.reason}
                </span>
              </td>
              <td className="px-6 py-5 text-right font-semibold">
                <span className={tx.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                  {tx.type === "INCOME" ? "+" : "-"} 
                  Rs. {tx.amount.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
}