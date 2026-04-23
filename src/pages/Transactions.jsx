import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFIlters';
import AddTransactionModal from '../components/AddTransactionModal';   // Make sure this path is correct
import { useTheme } from "../context/ThemeContext";

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
  const [isModalOpen, setIsModalOpen] = useState(false);     
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");


  const { dark } = useTheme();

  // Filter logic
  const filteredTransactions = transactions
    .filter((tx) => {
      const normalizedFilterType = String(filterType).toUpperCase();
      const txType = String(tx?.type ?? "").toUpperCase();
      const matchesType = normalizedFilterType === "ALL" || txType === normalizedFilterType;

      const q = searchTerm.trim().toLowerCase();
      const txName = String(tx?.name ?? "").toLowerCase();
      const txCategory = String(tx?.category?.name ?? tx?.category ?? "").toLowerCase();
      const txSource = String(tx?.source ?? "").toLowerCase();

      const matchesSearch =
        q.length === 0 ||
        txName.includes(q) ||
        txCategory.includes(q) ||
        txSource.includes(q);

      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen ${dark ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Transactions</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium ${dark ? "shadow-[0_8px_24px_rgba(96,165,250,0.25)]" : "shadow-sm"}`}
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
        dark={dark}
      />

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} dark={dark} />

      {/* Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        dark={dark}
      />
    </div>

    
  );
}