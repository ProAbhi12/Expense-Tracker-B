import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFilters';

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

export default function Transactions() {
  const [transactions] = useState(mockTransactions);
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic
  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesType = filterType === "ALL" || tx.type === filterType;
      const matchesSearch = 
        tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.source.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium"
          onClick={() => alert("Add Transaction Modal will open here")}
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <TransactionFilters 
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Transaction Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
}