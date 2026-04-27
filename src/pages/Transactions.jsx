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
      const incomeResponse = await fetch(`${API_BASE_URL}/income`);
      const expenseResponse = await fetch(`${API_BASE_URL}/expense`);

      if (!incomeResponse.ok) {
        throw new Error("Failed to fetch income");
      }

      if (!expenseResponse.ok) {
        throw new Error("Failed to fetch expense");
      }

      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();

      const allTransactions = [
        ...incomeData.map((tx) => ({
          id: tx.transactionId,
          name: tx.name,
          type: tx.type, // INCOME
          amount: tx.amount,
          reason: getPaymentMethodName(tx.method),
          date: new Date(tx.date).toISOString().split("T")[0],
          category: {
            id: tx.category?.Id,
            name: tx.category?.name,
          },
        })),

        // Expense mapping

        ...expenseData.map((tx) => ({
          id: tx.transactionId,
          name: tx.name,
          type: tx.type, // EXPENSE
          amount: tx.amount,
          reason: getPaymentMethodName(tx.method),
          date: new Date(tx.date).toISOString().split("T")[0],
          category: {
            id: tx.category?.Id,
            name: tx.category?.name,
          },
        })),
      ];

      setTransactions(allTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentMethodName = (methodValue) => {
    const methods = {
      0: "CASH",
      1: "ESEWA",
      2: "KHALTI",
      3: "MOBILE_BANKING",
    };
    return methods[methodValue] || "CASH";
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      const normalizedFilterType = filterType;

      const matchesType =
        normalizedFilterType === "ALL" || tx.type === normalizedFilterType;

      const q = searchTerm.trim().toLowerCase();

      const name = (tx?.name ?? "").toLowerCase();
      const category = (tx?.category?.name ?? "").toLowerCase();

      const matchesSearch =
        q.length === 0 || name.includes(q) || category.includes(q);

      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    fetchTransactions(); // refresh
  };

  const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome;

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${
        dark ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className={`text-3xl font-bold ${
              dark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            Transactions
          </h1>
          <p
            className={`text-sm mt-1 ${
              dark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Manage your income
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 ${dark ? "bg-slate-800" : "bg-white"}`}>
          <p>Total Balance</p>
          <p className="text-2xl text-green-600">
            Rs. {balance.toLocaleString()}
          </p>
        </div>

        <div className={`p-4 ${dark ? "bg-slate-800" : "bg-white"}`}>
          <p>Total Income</p>
          <p className="text-2xl text-green-600">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dark={dark}
      />

      {/* Loading */}
      {isLoading && <div>Loading...</div>}

      {/* Error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Table */}
      {!isLoading && !error && (
        <TransactionTable transactions={filteredTransactions} dark={dark} />
      )}

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
