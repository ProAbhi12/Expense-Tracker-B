import React, { useState } from "react";

const paymentMethods = [
  { value: "CASH", label: "Cash" },
  { value: "ESEWA", label: "eSewa" },
  { value: "KHALTI", label: "Khalti" },
  { value: "MOBILE_BANKING", label: "Mobile Banking" },
];

const transactionTypes = [
  { value: "INCOME", label: "Income", color: "green" },
  { value: "EXPENSE", label: "Expense", color: "red" },
];

const mockCategories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Housing" },       
  { id: 3, name: "Transportation" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Salary" },
  { id: 6, name: "Freelance" },
  { id: 7, name: "Utilities" },
  { id: 8, name: "Shopping" },
];

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    categoryId: "",
    source: "",
    reason: "CASH",
    date: new Date().toISOString().split("T")[0],
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.categoryId ||
      !formData.source ||
      !formData.amount
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      categoryId: parseInt(formData.categoryId),
      category: mockCategories.find(
        (cat) => cat.id === parseInt(formData.categoryId)
      ),
      source: formData.source,
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
      source: "",
      reason: "CASH",
      date: new Date().toISOString().split("T")[0],
      amount: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      {/* Increased top and bottom margin using my-12 and max-h */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl my-12 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-3xl leading-none text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form - Scrollable if needed */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {transactionTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: t.value }))
                    }
                    className={`py-3.5 rounded-2xl font-medium transition-all ${
                      formData.type === t.value
                        ? t.color === "green"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
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
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount (Rs.)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {mockCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Payment Method
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Source / Merchant
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g. Big Mart, Vianet"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
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
