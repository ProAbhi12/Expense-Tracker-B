import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  editingData,
  dark,
}) {
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]); // ✅ moved here
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
      if (editingData) {
        setFormData({
          name: editingData.name || "",
          type: editingData.type || "EXPENSE",
          categoryId: (() => {
            const id =
              editingData.categoryId ??
              editingData.CategoryId ??
              editingData.category_id;
            console.log("editingData full object:", editingData); // see exact field names
            console.log("resolved categoryId:", id);
            return id?.toString() || "";
          })(),
          amount: editingData.amount?.toString() || "",
          source: editingData.source || "",
          method: (() => {
            const raw = editingData.method ?? editingData.Method ?? 0;
            if (typeof raw === "number") return raw.toString();
            const idx = paymentMethods.findIndex(
              (m) => m.label.toLowerCase() === raw.toLowerCase(),
            );
            return (idx >= 0 ? idx : 0).toString();
          })(),
          date: editingData.date
            ? editingData.date.split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      } else {
        setFormData({
          name: "",
          type: "EXPENSE",
          categoryId: "",
          amount: "",
          source: "",
          method: "0",
          date: new Date().toISOString().split("T")[0],
        });
      }

      // Fetch categories
      fetch("https://localhost:7197/api/Category")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || data[0]?.id.toString() || "",
          }));
        })
        .catch((err) => console.error("Error loading categories:", err));

      // Fetch payment methods dynamically from enum endpoint
      fetch("https://localhost:7197/api/enums/transaction-methods")
        .then((res) => res.json())
        .then((data) => setPaymentMethods(data))
        .catch((err) => console.error("Error loading methods:", err));
    }
  }, [isOpen, editingData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Visible guard — tells you exactly what's missing
    if (!formData.name || !formData.amount || !formData.categoryId) {
      console.warn("Submit blocked:", {
        name: formData.name,
        amount: formData.amount,
        categoryId: formData.categoryId,
      });
      alert("Please fill in all required fields.");
      return;
    }

    // Lock controller to original type so PUT hits the right table
    const originalType = editingData?.type ?? formData.type;
    const controllerName = originalType === "INCOME" ? "Income" : "Expense";
    const isEditing = !!editingData;
    const recordId = editingData?.id ?? editingData?.Id;
    const url = isEditing
      ? `https://localhost:7197/api/${controllerName}/${recordId}`
      : `https://localhost:7197/api/${controllerName}`;

    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId),
      source: formData.source || "General",
      method: parseInt(formData.method),
      date: new Date(formData.date).toISOString(),
    };

    console.log(`[${isEditing ? "PUT" : "POST"}]`, url, payload); // debug log

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onAdd();
        onClose();
      } else {
        const err = await response.json();
        console.error("Server error:", err);
        alert(`Server error: ${JSON.stringify(err)}`);
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
            <h2 className="text-xl font-bold">
              {editingData ? "Edit Transaction" : "New Transaction"}
            </h2>
            <p className="text-white/80 text-xs mt-1">Record your data</p>
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
          {/* Type toggle — disabled during edit to prevent wrong-table PUT */}
          <div
            className={`flex p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-gray-100"}`}
          >
            <button
              type="button"
              disabled={!!editingData}
              onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
              className={`flex-1 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.type === "EXPENSE" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
            >
              Expense
            </button>
            <button
              type="button"
              disabled={!!editingData}
              onClick={() => setFormData({ ...formData, type: "INCOME" })}
              className={`flex-1 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.type === "INCOME" ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}
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
                  <option key={cat.id} value={cat.id.toString()}>
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
            {editingData
              ? `Update ${formData.type === "EXPENSE" ? "Expense" : "Income"}`
              : formData.type === "EXPENSE"
                ? "Save Expense"
                : "Save Income"}
          </button>
        </form>
      </div>
    </div>
  );
}
