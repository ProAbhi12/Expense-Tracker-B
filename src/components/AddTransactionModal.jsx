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

const mockCategories = [
  { id: 1, name: "Food & Drinks" },
  { id: 2, name: "Rent & Bills" },
  { id: 3, name: "Transportation" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Salary" },
  { id: 6, name: "Shopping" },
  { id: 7, name: "Others" },
];

export default function AddTransactionModal({ isOpen, onClose, onAdd, dark }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    categoryId: "1",
    amount: "",
    paymentMethod: "CASH",
    date: new Date().toISOString().split("T")[0],
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const newTransaction = {
      ...formData,
      id: Date.now(),
      amount: parseFloat(formData.amount),
      category: {
        name: mockCategories.find((c) => c.id === parseInt(formData.categoryId))
          ?.name,
      },
    };

    onAdd(newTransaction);
    onClose();
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
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Switcher */}
          <div
            className={`flex p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-gray-100"}`}
          >
            {transactionTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.value })}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  formData.type === t.value
                    ? `bg-white shadow-sm ${t.value === "EXPENSE" ? "text-red-600" : "text-green-600"}`
                    : "text-gray-500"
                }`}
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
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-xl font-bold focus:outline-none focus:ring-4 transition-all ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500/30 focus:ring-blue-500/5"
                    : "bg-gray-50 border-gray-100 text-gray-800 focus:border-blue-500/30 focus:ring-blue-500/5"
                }`}
                required
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
              >
                +Rs. {amt}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-[10px] font-bold uppercase mb-2 ${dark ? "text-slate-400" : "text-gray-400"}`}
            >
              Description
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="What was this for?"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                dark
                  ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                  : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
              }`}
              required
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
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20"
                    : "bg-white border-gray-200 text-gray-800 focus:ring-blue-500/20"
                }`}
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
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              formData.type === "EXPENSE"
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                : "bg-green-600 hover:bg-green-700 shadow-green-600/20"
            }`}
          >
            Save {formData.type === "EXPENSE" ? "Expense" : "Income"}
          </button>
        </form>
      </div>
    </div>
  );
}
