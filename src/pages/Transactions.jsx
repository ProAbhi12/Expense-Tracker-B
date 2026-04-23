import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable';
import TransactionFilters from '../components/TransactionFIlters';
import AddTransactionModal from '../components/AddTransactionModal';   // Make sure this path is correct
import AddButton from '../components/AddButton';
import { useTheme } from "../context/ThemeContext";
import sharedTransactions from "../dummyData/transactions.json";

const mockTransactions = sharedTransactions.map((tx) => ({
  ...tx,
  category: { name: tx.category },
}));

export default function Transactions() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);     
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");


  const { dark, gradient } = useTheme();

  // Filter logic
  const filteredTransactions = transactions
    .filter((tx) => {
      const normalizedFilterType = String(filterType).toUpperCase();
      const txType = String(tx?.type ?? "").toUpperCase();
      const matchesType = normalizedFilterType === "ALL" || txType === normalizedFilterType;

      const q = searchTerm.trim().toLowerCase();
      const txName = String(tx?.name ?? "").toLowerCase();
      const txCategory = String(tx?.category?.name ?? tx?.category ?? "").toLowerCase();

      const matchesSearch =
        q.length === 0 ||
        txName.includes(q) ||
        txCategory.includes(q);

      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen ${gradient ? "bg-gradient-to-br from-[#1a0f3f] via-[#2d1b4e] to-[#1a0f3f]" : dark ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Transactions</h1>
        <AddButton
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className={dark ? 'shadow-[0_8px_24px_rgba(96,165,250,0.25)]' : 'shadow-sm'}
        >
          + Add Transaction
        </AddButton>
      </div>

      {/* Filters */}
      <TransactionFilters 
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dark={dark}
        gradient={gradient}
      />

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} dark={dark} gradient={gradient} />

      {/* Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        dark={dark}
        gradient={gradient}
      />
    </div>

    
  );
}