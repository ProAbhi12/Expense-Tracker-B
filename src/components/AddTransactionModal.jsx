import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const paymentMethods = [
  { value: "0", label: "Cash" },
  { value: "1", label: "eSewa" },
  { value: "2", label: "Khalti" },
  { value: "3", label: "Mobile Banking" },
];

export default function AddTransactionModal({ isOpen, onClose, onAdd, dark }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    categoryId: "",
    amount: "",
    source: "",
    method: "0",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      fetch("https://localhost:7197/api/Category")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          if (data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              categoryId: data[0].id.toString(),
            }));
          }
        })
        .catch((err) => console.error("Error loading categories:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.categoryId) return;

    // 2. Decide which Controller to talk to
    const controllerName = formData.type === "INCOME" ? "Income" : "Expense";
    const url = `https://localhost:7197/api/${controllerName}`;

    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId),
      source: formData.source || "General",
      method: parseInt(formData.method),
      date: new Date(formData.date).toISOString(),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onAdd(); // Refresh the list
        onClose();
      } else {
        const err = await response.json();
        console.error("Server error:", err);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}
      >
        <div
          className={`p-6 text-white flex justify-between items-center ${formData.type === "EXPENSE" ? "bg-red-600" : "bg-green-600"}`}
        >
          <div>
            <h2 className="text-xl font-bold">New Transaction</h2>
            <p className="text-white/80 text-xs mt-1">Record your live data</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-sm font-medium"
        >
          <div
            className={`flex p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-gray-100"}`}
          >
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${formData.type === "EXPENSE" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "INCOME" })}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${formData.type === "INCOME" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-gray-500 mb-1 px-1 text-xs">
              Description
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
              placeholder="e.g. Groceries"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 mb-1 px-1 text-xs">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 mb-1 px-1 text-xs">
                Amount (Rs.)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className={`w-full p-2.5 border rounded-xl font-bold ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 mb-1 px-1 text-xs">
                Method
              </label>
              <select
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
              >
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 mb-1 px-1 text-xs">
                Source
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
                placeholder="e.g. Amazon Company"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1 px-1 text-xs">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg mt-2 transition-all active:scale-95 ${formData.type === "EXPENSE" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            {formData.type === "EXPENSE" ? "Save Expense" : "Save Income"}
          </button>
        </form>
      </div>
    </div>
  );
}
