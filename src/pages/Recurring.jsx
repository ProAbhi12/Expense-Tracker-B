import React, { useState } from "react";
import { CalendarDays, Repeat2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import recurringData from "../dummyData/recurring.json";

const initialRecurringItems = recurringData.items;
const recurringMethods = recurringData.methods;
const recurringFrequencies = recurringData.frequencies;

const formatCurrency = (value) =>
  `Rs. ${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatMethod = (method) =>
  String(method || "")
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Recurring = () => {
  const { dark, gradient } = useTheme();
  const [recurringItems, setRecurringItems] = useState(initialRecurringItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    method: "CASH",
    frequency: "Monthly",
    nextDate: new Date().toISOString().slice(0, 10),
    amount: "",
    type: "EXPENSE",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      method: "CASH",
      frequency: "Monthly",
      nextDate: new Date().toISOString().slice(0, 10),
      amount: "",
      type: "EXPENSE",
    });
  };

  const handleAddRecurring = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category.trim() || !formData.amount) {
      return;
    }

    const newRecurring = {
      id: Date.now(),
      title: formData.title.trim(),
      category: formData.category.trim(),
      method: formData.method,
      frequency: formData.frequency,
      nextDate: formData.nextDate,
      amount: Number(formData.amount),
      type: formData.type,
    };

    setRecurringItems((prev) => [newRecurring, ...prev]);
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
            Recurring
          </h1>
          <p className={gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}>
            Manage recurring income and expenses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          + Add Recurring
        </button>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <div className={`hidden md:grid grid-cols-7 gap-2 px-5 py-4 text-xs font-semibold uppercase tracking-wide ${gradient ? "text-purple-200 bg-slate-800/50" : dark ? "text-slate-400 bg-slate-800" : "text-gray-500 bg-gray-50"}`}>
          <span>Type</span>
          <span>Description</span>
          <span>Category</span>
          <span>Method</span>
          <span>Frequency</span>
          <span>Next Date</span>
          <span className="text-right">Amount</span>
        </div>

        <div className={gradient ? "divide-y divide-purple-700/30" : dark ? "divide-y divide-slate-700" : "divide-y divide-gray-100"}>
          {recurringItems.map((item) => (
            <div key={item.id} className={`px-5 py-4 ${gradient ? "hover:bg-slate-800/50" : dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}>
              <div className="hidden md:grid grid-cols-7 gap-2 items-center">
                <span className={`inline-flex text-xs px-2.5 py-1 rounded-full w-fit font-medium ${item.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {item.type === "INCOME" ? "Income" : "Expense"}
                </span>
                <span className={`font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{item.title}</span>
                <span className={gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}>{item.category}</span>
                <span className={gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}>{formatMethod(item.method)}</span>
                <span className={gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}>{item.frequency}</span>
                <span className={`inline-flex items-center gap-1.5 ${gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}`}>
                  <CalendarDays size={14} /> {item.nextDate}
                </span>
                <span className={`text-right font-semibold ${item.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                  {item.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="md:hidden space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${item.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.type === "INCOME" ? "Income" : "Expense"}
                  </span>
                  <span className={`font-semibold ${item.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {item.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <p className={`font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{item.title}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Category: <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}>{item.category}</span></p>
                  <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Method: <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}>{formatMethod(item.method)}</span></p>
                  <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Frequency: <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}>{item.frequency}</span></p>
                  <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Next: <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}>{item.nextDate}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
        <p className={`text-sm flex items-center gap-2 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>
          <Repeat2 size={16} className="text-blue-500" />
          Recurring rules currently use mock data and are ready to connect with your backend.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border overflow-hidden ${gradient ? "bg-slate-900/60 border-purple-700/40 backdrop-blur-sm" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${gradient ? "bg-slate-800/50 border-purple-700/30" : dark ? "border-slate-700" : "border-gray-200"}`}>
              <h2 className={`text-lg font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Add Recurring</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className={`text-2xl leading-none ${gradient ? "text-purple-300 hover:text-purple-100" : dark ? "text-slate-400 hover:text-slate-200" : "text-gray-400 hover:text-gray-600"}`}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRecurring} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div>
                  <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleFormChange}
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  >
                    {recurringFrequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Description</label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Spotify Subscription"
                  required
                  className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Category</label>
                  <input
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="e.g. Utilities"
                    required
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleFormChange}
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  >
                    {recurringMethods.map((method) => (
                      <option key={method} value={method}>{formatMethod(method)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Next Date</label>
                  <input
                    name="nextDate"
                    type="date"
                    value={formData.nextDate}
                    onChange={handleFormChange}
                    required
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}>Amount</label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className={`px-4 py-2 rounded-lg border ${dark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recurring;
