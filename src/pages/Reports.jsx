import React from "react";
import { useTheme } from "../context/ThemeContext";
import sharedTransactions from "../dummyData/transactions.json";

const Reports = () => {
  const { dark, gradient } = useTheme();

  const mockTransactions = sharedTransactions;

  // Calculate totals
  const totalIncome = mockTransactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = mockTransactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Category-wise expense breakdown
  const expensesByCategory = mockTransactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((acc, tx) => {
      const categoryName = tx?.category?.name ?? tx?.category;
      acc[categoryName] = (acc[categoryName] || 0) + tx.amount;
      return acc;
    }, {});

  return (
    <div className={`p-8 space-y-8 ${gradient ? "bg-gradient-to-br from-[#1a0f3f] via-[#2d1b4e] to-[#1a0f3f]" : dark ? "bg-slate-900 min-h-screen" : ""}`}>
      <h1 className={`text-3xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Income Card */}
        <div className={`border-l-4 border-green-500 p-6 rounded-lg ${gradient ? "bg-green-900/30" : dark ? "bg-green-900/20" : "bg-green-50"}`}>
          <h3 className={`font-medium ${gradient ? "text-green-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Total Income</h3>
          <p className="text-3xl font-bold text-green-500">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Expense Card */}
        <div className={`border-l-4 border-red-500 p-6 rounded-lg ${gradient ? "bg-red-900/30" : dark ? "bg-red-900/20" : "bg-red-50"}`}>
          <h3 className={`font-medium ${gradient ? "text-red-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Total Expenses</h3>
          <p className="text-3xl font-bold text-red-500">
            Rs. {totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* Balance Card */}
        <div
          className={`border-l-4 p-6 rounded-lg ${netBalance >= 0 ? "border-blue-500" : "border-orange-500"} ${gradient ? "bg-blue-900/30" : dark ? "bg-blue-900/20" : "bg-blue-50"}`}
        >
          <h3 className={`font-medium ${gradient ? "text-blue-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Net Balance</h3>
          <p
            className={`text-3xl font-bold ${netBalance >= 0 ? "text-blue-500" : "text-orange-500"}`}
          >
            Rs. {netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className={`border rounded-lg p-6 ${gradient ? "bg-slate-900/40 border-purple-700/40 backdrop-blur-sm shadow-[0_8px_24px_rgba(147,51,234,0.15)]" : dark ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "bg-white border-gray-200"}`}>
        <h2 className={`text-xl font-bold mb-4 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
          Expense Breakdown by Category
        </h2>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div
              key={category}
              className={`flex justify-between items-center p-3 rounded ${gradient ? "bg-purple-600/20" : dark ? "bg-slate-800" : "bg-gray-50"}`}
            >
              <span className={gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-700"}>{category}</span>
              <span className={`font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
                Rs. {amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
