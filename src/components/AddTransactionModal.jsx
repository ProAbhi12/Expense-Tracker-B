import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  editingData,
  dark,
}) {
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    categoryId: "",
    amount: "",
    source: "",
    method: "0",
    date: new Date().toISOString().split("T")[0],
  });

  // Track if we've already loaded data for this edit session
  const hasInitializedRef = useRef(false);

  // Helper: Extract categoryId - handles ALL possible API formats
  const extractCategoryId = (data) => {
    if (!data) return "";
    // Try all possible property names
    const id =
      data.categoryId ??
      data.CategoryId ??
      data.category_id ??
      data.categoryId?.toString() ??
      data.category?.id ??
      data.Category?.Id;

    // Convert to string and clean
    const result = id?.toString()?.trim();
    return result && result !== "undefined" ? result : "";
  };

  // Helper: Extract method
  const extractMethod = (data, methods) => {
    const raw = data?.method ?? data?.Method ?? data?.paymentMethod ?? 0;
    if (typeof raw === "number") return String(raw);
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      // Try matching by label, value, or name
      const idx = methods.findIndex(
        (m) =>
          String(m.label)?.toLowerCase() === trimmed.toLowerCase() ||
          String(m.value)?.toLowerCase() === trimmed.toLowerCase() ||
          String(m.id)?.toLowerCase() === trimmed.toLowerCase(),
      );
      return idx >= 0 ? String(methods[idx].value ?? methods[idx].id) : "0";
    }
    return "0";
  };

  // Fetch dropdown data once when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const [catRes, methodRes] = await Promise.all([
          fetch("https://localhost:7197/api/Category"),
          fetch("https://localhost:7197/api/enums/transaction-methods"),
        ]);

        if (!isMounted) return;

        const catData = await catRes.json();
        const methodData = await methodRes.json();

        setCategories(Array.isArray(catData) ? catData : []);
        setPaymentMethods(Array.isArray(methodData) ? methodData : []);
      } catch (err) {
        console.error("Failed to load dropdown data:", err);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Update form when editingData changes AND data is ready
  useEffect(() => {
    if (!isOpen) {
      hasInitializedRef.current = false;
      return;
    }

    // Reset initialization flag when switching between edit/new
    if (!editingData) {
      hasInitializedRef.current = false;
    }

    // Only initialize once per edit session
    if (editingData && !hasInitializedRef.current) {
      // Wait for categories to load before setting form
      if (categories.length === 0) return;

      const rawCategoryId = extractCategoryId(editingData);

      // Find matching category (with type-safe comparison)
      const matchedCategory = categories.find(
        (cat) => String(cat.id) === String(rawCategoryId),
      );

      // Fallback: try matching by name if ID doesn't work
      const fallbackCategory =
        !matchedCategory && editingData.categoryName
          ? categories.find(
              (cat) =>
                cat.name?.toLowerCase() ===
                editingData.categoryName.toLowerCase(),
            )
          : null;

      const finalCategoryId = matchedCategory
        ? String(matchedCategory.id)
        : fallbackCategory
          ? String(fallbackCategory.id)
          : rawCategoryId || categories[0]?.id?.toString() || "";

      setFormData({
        name: editingData.name || "",
        type: editingData.type || "EXPENSE",
        categoryId: finalCategoryId, // 👈 Always string
        amount: editingData.amount?.toString() || "",
        source: editingData.source || "",
        method: extractMethod(editingData, paymentMethods),
        date: editingData.date
          ? editingData.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });

      hasInitializedRef.current = true;

      console.log("✅ Form initialized with categoryId:", finalCategoryId);
    }

    // For NEW transactions (no editingData)
    if (!editingData && categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categories[0]?.id?.toString() || "",
      }));
    }
  }, [isOpen, editingData, categories, paymentMethods]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        type: "EXPENSE",
        categoryId: "",
        amount: "",
        source: "",
        method: "0",
        date: new Date().toISOString().split("T")[0],
      });
      hasInitializedRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount || !formData.categoryId) {
      alert("Please fill in all required fields.");
      return;
    }

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
      categoryId: parseInt(formData.categoryId), // Convert back to int for API
      source: formData.source || "General",
      method: parseInt(formData.method),
      date: new Date(formData.date).toISOString(),
    };

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
        alert(`Error: ${err.message || JSON.stringify(err)}`);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Check console for details.");
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
          {/* Type toggle */}
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
                value={String(formData.categoryId || "")} // 👈 CRITICAL: Force string
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
                required
              >
                {categories.length === 0 ? (
                  <option value="">Loading...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {" "}
                      {/* 👈 String value */}
                      {cat.name}
                    </option>
                  ))
                )}
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
                value={String(formData.method || "0")}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-200"}`}
              >
                {paymentMethods.length === 0 ? (
                  <option value="0">Loading...</option>
                ) : (
                  paymentMethods.map((m) => (
                    <option
                      key={m.value ?? m.id}
                      value={String(m.value ?? m.id)}
                    >
                      {m.label ?? m.name}
                    </option>
                  ))
                )}
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
