import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  UtensilsCrossed,
  Car,
  Home,
  Film,
  ShoppingCart,
  Lightbulb,
  Heart,
  BookOpen,
  Receipt,
  X,
  Edit2,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

// ========== ICON MAPPING ==========
const ICON_MAP = {
  Salary: Receipt,
  Food: UtensilsCrossed,
  Rent: Home,
  Utilities: Lightbulb,
  Transport: Car,
  Shopping: ShoppingCart,
  Entertainment: Film,
  Health: Heart,
};

const COLOR_SWATCHES = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#334155",
];

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;
const getIcon = (name) => ICON_MAP[name] || Receipt;

// ========== ADD/EDIT MODAL COMPONENT ==========
const CategoryModal = ({ onClose, onRefresh, editingCategory = null }) => {
  const { dark } = useTheme();
  const [form, setForm] = useState(
    editingCategory || {
      name: "",
      budget: "",
      color: COLOR_SWATCHES[0],
      type: "EXPENSE",
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const budgetVal = parseFloat(form.budget.toString().replace(/,/g, ""));
    if (!form.name || isNaN(budgetVal)) return;

    try {
      const url = editingCategory
        ? `https://localhost:7197/api/Category/${editingCategory.id}`
        : "https://localhost:7197/api/Category";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory?.id || 0,
          name: form.name,
          budget: budgetVal,
          color: form.color,
          type: form.type === "INCOME" ? 0 : 1,
        }),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {editingCategory ? "Edit Category" : "New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Category Name
            </label>
            <input
              className={`w-full p-2.5 border rounded-xl outline-none ${dark ? "bg-slate-800 border-slate-700" : ""}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Groceries"
              required
              disabled={editingCategory?.isDefault}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Type
              </label>
              <select
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700" : ""}`}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                disabled={editingCategory?.isDefault}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Budget Limit
              </label>
              <input
                className={`w-full p-2.5 border rounded-xl ${dark ? "bg-slate-800 border-slate-700" : ""}`}
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="3000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Category Color
            </label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-xl dark:border-slate-800">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${form.color === c ? "border-blue-500 scale-110 shadow-lg" : "border-transparent opacity-50"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== BUDGET CARD COMPONENT ==========
const BudgetCard = ({ category, onEdit, onDelete }) => {
  const { getSpentByCategory } = useApp();
  const { dark } = useTheme();
  const Icon = getIcon(category.name);
  const spent = getSpentByCategory(category.name);
  const remaining = category.budget - spent;
  const percentage = Math.min((spent / (category.budget || 1)) * 100, 100);

  return (
    <div
      className={`group rounded-2xl border p-5 transition-all hover:shadow-md ${dark ? "border-slate-800 bg-slate-900" : "bg-white border-gray-100 shadow-sm"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
            }}
          >
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">{category.name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Limit: {formatCurrency(category.budget)}
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          {!category.isDefault && (
            <button
              onClick={() => onDelete(category.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <div
        className={`h-2.5 w-full rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-gray-100"}`}
      >
        <div
          className="h-full transition-all duration-1000 ease-out rounded-full"
          style={{
            width: `${percentage}%`,
            background: spent > category.budget ? "#ef4444" : category.color,
          }}
        />
      </div>
      <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-tighter">
        <span className="text-gray-400">
          {Math.round(percentage)}% of limit used
        </span>
        <span
          className={
            spent > category.budget
              ? "text-red-500 animate-pulse"
              : "text-green-600"
          }
        >
          {spent > category.budget
            ? "Over Limit!"
            : `${formatCurrency(remaining)} left`}
        </span>
      </div>
    </div>
  );
};

// ========== MAIN PAGE ==========
const Budgets = () => {
  const { dark } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://localhost:7197/api/Category");
      const data = await res.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    await fetch(`https://localhost:7197/api/Category/${id}`, {
      method: "DELETE",
    });
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = budgets.map((b) => ({
    name: b.name,
    value: b.budget,
    color: b.color,
  }));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2
            className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}
          >
            Categories with Budget
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Control your monthly limits per category.
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, data: null })}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20"
        >
          + New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-20 text-center text-gray-400 italic">
            Syncing with SQL Server...
          </div>
        ) : (
          budgets.map((b) => (
            <BudgetCard
              key={b.id}
              category={b}
              onEdit={(d) => setModal({ open: true, data: d })}
              onDelete={deleteCategory}
            />
          ))
        )}
      </div>

      {/* Budget Overview (Charts) */}
      {!loading && budgets.length > 0 && (
        <div
          className={`rounded-2xl border p-6 ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 text-sm uppercase tracking-widest opacity-60 flex items-center gap-2">
            <PieIcon size={16} className="text-blue-500" /> Budget Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `Rs. ${value.toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {modal.open && (
        <CategoryModal
          onClose={() => setModal({ open: false, data: null })}
          onRefresh={loadData}
          editingCategory={modal.data}
        />
      )}
    </div>
  );
};

export default Budgets;
