import React, { useState } from "react";
import { BellRing, CalendarClock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import billRemindersData from "../dummyData/billReminders.json";

const initialBillReminders = billRemindersData.items;
const reminderStatuses = billRemindersData.statuses;

const formatCurrency = (value) =>
  `Rs. ${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getStatusClasses = (status) => {
  if (status === "Overdue") return "bg-red-100 text-red-700";
  if (status === "Due Soon") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
};

const BillReminder = () => {
  const { dark, gradient } = useTheme();
  const [billReminders, setBillReminders] = useState(initialBillReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    provider: "",
    dueDate: new Date().toISOString().slice(0, 10),
    amount: "",
    status: "Upcoming",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      provider: "",
      dueDate: new Date().toISOString().slice(0, 10),
      amount: "",
      status: "Upcoming",
    });
  };

  const handleAddReminder = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.provider.trim() || !formData.amount) {
      return;
    }

    const newReminder = {
      id: Date.now(),
      title: formData.title.trim(),
      provider: formData.provider.trim(),
      dueDate: formData.dueDate,
      amount: Number(formData.amount),
      status: formData.status,
    };

    setBillReminders((prev) => [newReminder, ...prev]);
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
            Bill Reminder
          </h1>
          <p className={gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}>
            Track upcoming, due, and overdue bills.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          + Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl border p-4 ${gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
          <p className={gradient ? "text-purple-200 text-sm" : dark ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>Total Bills</p>
          <p className={`text-2xl font-bold mt-1 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{billReminders.length}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
          <p className={gradient ? "text-purple-200 text-sm" : dark ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>Due Soon</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{billReminders.filter((bill) => bill.status === "Due Soon").length}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
          <p className={gradient ? "text-purple-200 text-sm" : dark ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>Overdue</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{billReminders.filter((bill) => bill.status === "Overdue").length}</p>
        </div>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <div className={`hidden md:grid grid-cols-5 gap-2 px-5 py-4 text-xs font-semibold uppercase tracking-wide ${gradient ? "text-purple-200 bg-slate-800/50" : dark ? "text-slate-400 bg-slate-800" : "text-gray-500 bg-gray-50"}`}>
          <span>Bill</span>
          <span>Provider</span>
          <span>Due Date</span>
          <span>Status</span>
          <span className="text-right">Amount</span>
        </div>

        <div className={gradient ? "divide-y divide-purple-700/30" : dark ? "divide-y divide-slate-700" : "divide-y divide-gray-100"} style={{backgroundColor: gradient ? 'rgba(15, 23, 42, 0.2)' : ''}}>
          {billReminders.map((bill) => (
            <div key={bill.id} className={`px-5 py-4 ${gradient ? "hover:bg-slate-800/50" : dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}>
              <div className="hidden md:grid grid-cols-5 gap-2 items-center">
                <span className={`font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{bill.title}</span>
                <span className={gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}>{bill.provider}</span>
                <span className={`inline-flex items-center gap-1.5 ${gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-600"}`}>
                  <CalendarClock size={14} /> {bill.dueDate}
                </span>
                <span className={`inline-flex text-xs px-2.5 py-1 rounded-full w-fit font-medium ${getStatusClasses(bill.status)}`}>
                  {bill.status}
                </span>
                <span className="text-right font-semibold text-red-600">{formatCurrency(bill.amount)}</span>
              </div>

              <div className="md:hidden space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className={`font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{bill.title}</p>
                  <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${getStatusClasses(bill.status)}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Provider: <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}>{bill.provider}</span></p>
                  <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Due: <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-700"}>{bill.dueDate}</span></p>
                </div>
                <p className="font-semibold text-red-600">{formatCurrency(bill.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
        <p className={`text-sm flex items-center gap-2 ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>
          <BellRing size={16} className="text-blue-500" />
          Reminder notifications are UI-ready and can be connected to alerts next.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border overflow-hidden ${gradient ? "bg-slate-900/60 border-purple-700/40 backdrop-blur-sm" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${gradient ? "bg-slate-800/50 border-purple-700/30" : dark ? "border-slate-700" : "border-gray-200"}`}>
              <h2 className={`text-lg font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Add Bill Reminder</h2>
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

            <form onSubmit={handleAddReminder} className="p-5 space-y-4">
              <div>
                <label className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>Bill Title</label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Water Bill"
                  required
                  className={`mt-1 w-full px-3 py-2 rounded-lg border ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-300" : dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>Provider</label>
                  <input
                    name="provider"
                    type="text"
                    value={formData.provider}
                    onChange={handleFormChange}
                    placeholder="e.g. KUKL"
                    required
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-300" : dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>Due Date</label>
                  <input
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    required
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white" : dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>Amount</label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-300" : dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-800"}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-700"}`}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className={`mt-1 w-full px-3 py-2 rounded-lg border ${gradient ? "bg-slate-800/50 border-purple-700/50 text-white" : dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
                  >
                    {reminderStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className={`px-4 py-2 rounded-lg border ${gradient ? "border-purple-700/50 text-purple-200 hover:bg-purple-600/20" : dark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
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

export default BillReminder;
