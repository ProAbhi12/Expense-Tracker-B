import React, { useState, useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import TransactionFilters from "../components/TransactionFIlters";
import AddTransactionModal from "../components/AddTransactionModal";
import { useTheme } from "../context/ThemeContext";

const API_BASE_URL = "https://localhost:7197/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { dark } = useTheme();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetching all transactions from our new unified endpoint
      const response = await fetch(
        `${API_BASE_URL}/Transactions/alltransactions`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions from server");
      }

      const data = await response.json();
      // console.log("Fetched transactions:", data);
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesType = filterType === "ALL" || tx.type === filterType;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        (tx.name || "").toLowerCase().includes(q) ||
        (tx.categoryName || "").toLowerCase().includes(q);

      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddTransaction = () => {
    fetchTransactions(); // Simply refresh the list after adding
  };

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${dark ? "bg-slate-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h1
            className={`text-3xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}
          >
            Transactions
          </h1>
          <p
            className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}
          >
            History of your financial activities
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary Cards - Corrected Math */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700 text-white shadow-none" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Available Balance
          </p>
          <p
            className={`text-2xl font-black ${balance >= 0 ? "text-blue-600" : "text-red-500"}`}
          >
            Rs. {balance.toLocaleString()}
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700 text-white shadow-none" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Total Income
          </p>
          <p className="text-2xl font-black text-green-600">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700 text-white shadow-none" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Total Expenses
          </p>
          <p className="text-2xl font-black text-red-500">
            Rs. {totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      <TransactionFilters
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dark={dark}
      />

      {isLoading ? (
        <div className="p-20 text-center text-gray-400 italic">
          Syncing with SQL Server...
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      ) : (
        <TransactionTable transactions={filteredTransactions} dark={dark} />
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        dark={dark}
      />
    </div>
  );
}
