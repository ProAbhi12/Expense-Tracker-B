import React, { useState } from 'react';
import transactionFormData from '../dummyData/transactionFormData.json';
import categoryData from '../dummyData/categoryData.json';

const paymentMethods = transactionFormData.paymentMethods;
const transactionTypes = transactionFormData.transactionTypes;
const mockCategories = categoryData.categoryOptions.map((item, index) => ({
  id: index + 1,
  name: item.category,
}));

export default function AddTransactionModal({ isOpen, onClose, onAdd, dark, gradient }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    categoryId: "",
    reason: "CASH",
    date: new Date().toISOString().slice(0, 16),
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.amount) {
      alert("Please fill all required fields!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      categoryId: parseInt(formData.categoryId),
      category: mockCategories.find(cat => cat.id === parseInt(formData.categoryId)),
      reason: formData.reason,
      date: formData.date,
      amount: parseFloat(formData.amount),
    };

    onAdd(newTransaction);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "EXPENSE",
      categoryId: "",
      reason: "CASH",
      date: new Date().toISOString().slice(0, 16),
      amount: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      
      {/* Increased top and bottom margin using my-12 and max-h */}
      <div
        className={`rounded-3xl w-full max-w-md my-12 max-h-[90vh] overflow-hidden border ${
          gradient
            ? "bg-slate-900/60 border-purple-700/40 backdrop-blur-sm shadow-[0_12px_32px_rgba(147,51,234,0.2)]"
            : dark
            ? "bg-slate-900 border-slate-700 shadow-[0_12px_32px_rgba(148,163,184,0.16)]"
            : "bg-white border-gray-200 shadow-xl"
        }`}
      >

        {/* Header */}
        <div className={`px-6 py-5 border-b flex justify-between items-center ${gradient ? "bg-slate-800/50 border-purple-700/30" : dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
          <h2 className={`text-xl font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Add New Transaction</h2>
          <button 
            onClick={onClose}
            className={`text-3xl leading-none transition-colors ${gradient ? "text-purple-300 hover:text-purple-100" : dark ? "text-slate-400 hover:text-slate-200" : "text-gray-400 hover:text-gray-600"}`}
          >
            ×
          </button>
        </div>

        {/* Form - Scrollable if needed */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Type Selection */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>Type</label>
              <div className="grid grid-cols-2 gap-3">
                {transactionTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: t.value }))}
                    className={`py-3.5 rounded-2xl font-medium transition-all ${
                      formData.type === t.value
                        ? t.color === "green" 
                          ? "bg-green-600 text-white" 
                          : "bg-red-600 text-white"
                        : gradient
                          ? "bg-slate-800/50 hover:bg-slate-700/50 text-purple-100 border border-purple-700/30"
                          : dark
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Description</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-300" : dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Amount (Rs.)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-300" : dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                required
              />
            </div>

            {/* Category & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white" : dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  required
                >
                  <option value="">Select Category</option>
                  {mockCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Payment Method</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white" : dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white" : dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3.5 border rounded-2xl font-medium transition-colors ${gradient ? "border-purple-700/50 text-purple-200 hover:bg-purple-600/20" : dark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}