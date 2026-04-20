import React from "react";
import { useTheme } from "../context/ThemeContext";

const Reports = () => {
  const { dark } = useTheme();

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
      amount: 45000,
    },
    {
      id: 2,
      name: "Monthly Grocery",
      type: "EXPENSE",
      category: { name: "Food" },
      source: "Big Mart",
      reason: "CASH",
      date: "2026-04-18",
      amount: 8500,
    },
    {
      id: 3,
      name: "Internet Bill",
      type: "EXPENSE",
      category: { name: "Utilities" },
      source: "Vianet",
      reason: "ESEWA",
      date: "2026-04-17",
      amount: 1200,
    },
  ];

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
      const categoryName = tx.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + tx.amount;
      return acc;
    }, {});

  return (
    <div className={`p-8 space-y-8 ${dark ? "bg-slate-900 min-h-screen" : ""}`}>
      <h1 className={`text-3xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Income Card */}
        <div className={`border-l-4 border-green-500 p-6 rounded-lg ${dark ? "bg-green-900/20" : "bg-green-50"}`}>
          <h3 className={`font-medium ${dark ? "text-slate-300" : "text-gray-600"}`}>Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Expense Card */}
        <div className={`border-l-4 border-red-500 p-6 rounded-lg ${dark ? "bg-red-900/20" : "bg-red-50"}`}>
          <h3 className={`font-medium ${dark ? "text-slate-300" : "text-gray-600"}`}>Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            Rs. {totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* Balance Card */}
        <div
          className={`border-l-4 p-6 rounded-lg ${netBalance >= 0 ? "border-blue-500" : "border-orange-500"} ${dark ? "bg-blue-900/20" : "bg-blue-50"}`}
        >
          <h3 className={`font-medium ${dark ? "text-slate-300" : "text-gray-600"}`}>Net Balance</h3>
          <p
            className={`text-3xl font-bold ${netBalance >= 0 ? "text-blue-600" : "text-orange-600"}`}
          >
            Rs. {netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className={`border rounded-lg p-6 ${dark ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "bg-white border-gray-200"}`}>
        <h2 className={`text-xl font-bold mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}>
          Expense Breakdown by Category
        </h2>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div
              key={category}
              className={`flex justify-between items-center p-3 rounded ${dark ? "bg-slate-800" : "bg-gray-50"}`}
            >
              <span className={dark ? "text-slate-300" : "text-gray-700"}>{category}</span>
              <span className={`font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
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
