import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import TransactionTable from "../components/TransactionTable";
import TransactionFilters from "../components/TransactionFIlters";
import AddTransactionModal from "../components/AddTransactionModal";

const API_BASE_URL = "https://localhost:7197/api";

const Transactions = () => {
  const { dark } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null); // TRACK EDITING
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/Transactions/alltransactions`,
      );
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const controller = type === "INCOME" ? "Income" : "Expense";
    try {
      const response = await fetch(`${API_BASE_URL}/${controller}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchTransactions();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- OPEN MODAL IN EDIT MODE ---
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // --- OPEN MODAL IN NEW MODE ---
  const openNewModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const filteredData = transactions.filter((t) => {
    const matchesType = filterType === "ALL" || t.type === filterType;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.categoryName || "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${dark ? "bg-slate-900 text-white" : "bg-gray-50"}`}
    >
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-sm opacity-60 font-medium tracking-tight">
            Manage your financial logs with real-time SQL connection.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          + Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Balance
          </p>
          <p className="text-2xl font-black text-blue-600">
            Rs. {(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Income
          </p>
          <p className="text-2xl font-black text-green-600">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Expense
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

      {loading ? (
        <div className="p-20 text-center text-gray-400 italic">
          Syncing with SQL Server...
        </div>
      ) : (
        <div
          className={`rounded-xl border shadow-sm overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
        >
          <TransactionTable
            transactions={filteredData}
            onDelete={handleDelete}
            onEdit={handleEdit}
            dark={dark}
          />
        </div>
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={fetchTransactions}
        editingData={editingTransaction}
        dark={dark}
      />
    </div>
  );
};

export default Transactions;
