import React, { useState } from 'react';

const Reports = () => {
  // Same mock transactions from Transactions.jsx
  const mockTransactions = [
    {
      id: 1,
      name: "Salary Deposit",
      type: "INCOME",
      category: { name: "Salary" },
      source: "Company XYZ",
      reason: "MOBILE_BANKING",
      date: "2026-04-15",
      amount: 45000
    },
    {
      id: 2,
      name: "Monthly Grocery",
      type: "EXPENSE",
      category: { name: "Food" },
      source: "Big Mart",
      reason: "CASH",
      date: "2026-04-18",
      amount: 8500
    },
    {
      id: 3,
      name: "Internet Bill",
      type: "EXPENSE",
      category: { name: "Utilities" },
      source: "Vianet",
      reason: "ESEWA",
      date: "2026-04-17",
      amount: 1200
    }
  ];

  // Calculate totals
  const totalIncome = mockTransactions
    .filter(tx => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = mockTransactions
    .filter(tx => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Category-wise expense breakdown
  const expensesByCategory = mockTransactions
    .filter(tx => tx.type === "EXPENSE")
    .reduce((acc, tx) => {
      const categoryName = tx.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + tx.amount;
      return acc;
    }, {});

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <h3 className="text-gray-600 font-medium">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">Rs. {totalIncome.toLocaleString()}</p>
        </div>

        {/* Expense Card */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <h3 className="text-gray-600 font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">Rs. {totalExpenses.toLocaleString()}</p>
        </div>

        {/* Balance Card */}
        <div className={`bg-blue-50 border-l-4 p-6 rounded-lg ${netBalance >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
          <h3 className="text-gray-600 font-medium">Net Balance</h3>
          <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            Rs. {netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown by Category</h2>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">{category}</span>
              <span className="font-bold text-gray-800">Rs. {amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;