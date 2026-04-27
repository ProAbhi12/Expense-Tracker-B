import React, { useState } from "react";
import { X, ArrowUpCircle, ArrowDownCircle, Calendar } from "lucide-react";

const transactionTypes = [
  { value: "INCOME", label: "Income", icon: ArrowUpCircle },
  { value: "EXPENSE", label: "Expense", icon: ArrowDownCircle },
];

const paymentMethods = [
  { value: "CASH", label: "Cash" },
  { value: "ESEWA", label: "eSewa" },
  { value: "KHALTI", label: "Khalti" },
  { value: "MOBILE_BANKING", label: "Mobile Banking" },
];

// Mock categories (same as before)
const mockCategories = [
  { id: 1, name: "Food & Drinks" },
  { id: 2, name: "Rent & Bills" },
  { id: 3, name: "Transportation" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Salary" },
  { id: 6, name: "Shopping" },
  { id: 7, name: "Others" },
];

// Map payment method strings to enum values expected by backend
const paymentMethodMap = {
  "CASH": 0,
  "ESEWA": 1,
  "KHALTI": 2,
  "MOBILE_BANKING": 3
};

// API base URL - hardcoded for now
const API_BASE_URL = "https://localhost:7197/api";

export default function AddTransactionModal({ isOpen, onClose, onAdd, dark }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    Id: "1",
    amount: "",
    paymentMethod: "CASH",
    source: "",
    date: new Date().toISOString().split("T")[0],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.amount || !formData.source) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API based on transaction type
      const transactionData = {
        name: formData.name,
        source: formData.source,
        amount: parseFloat(formData.amount),
        method: paymentMethodMap[formData.paymentMethod],
        date: new Date(formData.date).toISOString(),
        Id: parseInt(formData.Id),
      };

      // Use different endpoints for income and expense
      const endpoint = formData.type === "INCOME" 
        ? `${API_BASE_URL}/income` 
        : `${API_BASE_URL}/expense`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.title || "Failed to save transaction");
      }

      const savedTransaction = await response.json();

      // Transform API response to match the format expected by parent component
      const newTransaction = {
        id: savedTransaction.transactionId,
        name: savedTransaction.name,
        type: savedTransaction.type,
        amount: savedTransaction.amount,
        paymentMethod: formData.paymentMethod,
        date: savedTransaction.date.split("T")[0],
        category: {
          id: savedTransaction.category?.Id || parseInt(formData.Id),
          name: savedTransaction.category?.name || mockCategories.find(c => c.id === parseInt(formData.Id))?.name,
        },
      };

      onAdd(newTransaction);
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        type: "EXPENSE",
        Id: "1",
        amount: "",
        paymentMethod: "CASH",
        source: "",
        date: new Date().toISOString().split("T")[0],
      });
      
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError(err.message || "Failed to save transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addQuickAmount = (amt) => {
    setFormData((prev) => ({
      ...prev,
      amount: (parseFloat(prev.amount || 0) + amt).toString(),
    }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <div
        className={`w-full max-w-md my-8 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}
      >
        {/* Creative Header */}
        <div
          className={`p-6 text-white flex justify-between items-center transition-colors duration-300 ${formData.type === "EXPENSE" ? "bg-red-600" : "bg-green-600"}`}
        >
          <div>
            <h2 className="text-xl font-bold text-white">Add New Entry</h2>
            <p className="text-white/80 text-xs mt-1 font-medium">
              Record your financial flow
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg text-white"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${dark ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-600"}`}>
              {error}
            </div>
          )}

          {/* Type Switcher */}
          <div
            className={`flex p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-gray-100"}`}
          >
            {transactionTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.value, error: "" })}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  formData.type === t.value
                    ? `bg-white shadow-sm ${t.value === "EXPENSE" ? "text-red-600" : "text-green-600"}`
                    : "text-gray-500"
                }`}
                disabled={isLoading}
              >
                <t.icon size={16} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div>
            <label
              className={`block text-[10px] font-bold uppercase mb-2 ${dark ? "text-slate-400" : "text-gray-400"}`}
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                Rs.
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value, error: "" })
                }
                placeholder="0.00"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-xl font-bold focus:outline-none focus:ring-4 transition-all ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500/30 focus:ring-blue-500/5"
                    : "bg-gray-50 border-gray-100 text-gray-800 focus:border-blue-500/30 focus:ring-blue-500/5"
                }`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {[100, 500, 1000, 5000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => addQuickAmount(amt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  dark
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                +Rs. {amt}
              </button>
            ))}
          </div>

          {/* Name */}
          <div>
            <label
              className={`block text-[10px] font-bold uppercase mb-2 ${dark ? "text-slate-400" : "text-gray-400"}`}
            >
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value, error: "" })
              }
              placeholder="What was this for?"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                dark
                  ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                  : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
              }`}
              required
              disabled={isLoading}
            />
          </div>

          {/* Source */}
          <div>
            <label
              className={`block text-[10px] font-bold uppercase mb-2 ${
                dark ? "text-slate-400" : "text-gray-400"
              }`}
            >
              Source
            </label>

            <input
              type="text"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              placeholder="e.g. Salary, Shop, Freelance"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                dark
                  ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                  : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
              }`}
              required
              disabled={isLoading}
            />
          </div>

          {/* Category & Payment Method Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-[10px] font-bold uppercase mb-2 ${dark ? "text-slate-400" : "text-gray-400"}`}
              >
                Category
              </label>
              <select
                value={formData.Id}
                onChange={(e) =>
                  setFormData({ ...formData, Id: e.target.value })
                }
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                    : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
                }`}
                disabled={isLoading}
              >
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={`block text-[10px] font-bold uppercase mb-2 ${dark ? "text-slate-400" : "text-gray-400"}`}
              >
                Payment / Income Source
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                    : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
                }`}
                disabled={isLoading}
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label
              className={`block text-[10px] font-bold uppercase mb-2 ${dark ? "text-slate-400" : "text-gray-400"}`}
            >
              Transaction Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                    : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
                }`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            } ${
              formData.type === "EXPENSE"
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                : "bg-green-600 hover:bg-green-700 shadow-green-600/20"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              `Save ${formData.type === "EXPENSE" ? "Expense" : "Income"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}