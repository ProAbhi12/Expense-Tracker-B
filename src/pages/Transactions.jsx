import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFilters';
import AddTransactionModal from '../components/AddTransactionModal';   // Make sure this path is correct

import React from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, Calendar } from 'lucide-react';
import { useTheme } from "../ThemeContext";

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
  },
  {
    id: 4,
    name: "Freelance Payment",
    type: "INCOME",
    category: { name: "Freelance" },
    source: "Upwork",
    reason: "KHALTI",
    date: "2026-04-16",
    amount: 25000
  }
];

export default function Transactions() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);        // ← This was missing!
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");


    const { dark } = useTheme();
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

  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-sm"
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

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} />

      {/* Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}