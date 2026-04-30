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
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingCategory ? "Edit Category" : "New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
              Category Name
            </label>
            <input
              className={`w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Groceries"
              required
              disabled={editingCategory?.isDefault}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
                Type
              </label>
              <select
                className={`w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                disabled={editingCategory?.isDefault}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-1">
                Budget Limit
              </label>
              <input
                className={`w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="3000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase mb-2">
              Category Color
            </label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-xl dark:border-slate-700">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${form.color === c ? "border-blue-500 scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-colors"
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
      className={`group rounded-2xl border p-5 transition-all hover:shadow-md ${dark ? "border-slate-700 bg-slate-800" : "bg-white border-gray-200 shadow-sm"}`}
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
            <h3 className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>
              {category.name}
            </h3>
            <p className={`text-[10px] font-medium uppercase tracking-wide ${dark ? "text-slate-300" : "text-gray-600"}`}>
              Limit: {formatCurrency(category.budget)}
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className={`p-2 transition-colors ${dark ? "text-slate-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"}`}
          >
            <Edit2 size={14} />
          </button>
          {!category.isDefault && (
            <button
              onClick={() => onDelete(category.id)}
              className={`p-2 transition-colors ${dark ? "text-slate-400 hover:text-red-400" : "text-gray-500 hover:text-red-600"}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`h-2.5 w-full rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-gray-200"}`}
      >
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${percentage}%`,
            background: spent > category.budget ? "#ef4444" : category.color,
          }}
        />
      </div>

      <div className="flex justify-between mt-3 text-[10px] font-medium uppercase tracking-wide">
        <span className={dark ? "text-slate-200" : "text-gray-700"}>
          {Math.round(percentage)}% used
        </span>
        <span
          className={
            spent > category.budget
              ? `font-semibold ${dark ? "text-red-400" : "text-red-600"}`
              : `font-semibold ${dark ? "text-green-400" : "text-green-600"}`
          }
        >
          {spent > category.budget
            ? "Over limit"
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
    <div
      className={`space-y-6 pb-20 ${dark ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1
              className={`text-3xl font-bold ${dark ? "text-white" : "text-gray-800"}`}
            >
              Categories with Budget{" "}
            </h1>
            <p
              className={`text-sm mt-1 font-medium ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Control your monthly limits per category
            </p>
          </div>
          <button
            onClick={() => setModal({ open: true, data: null })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-colors"
          >
            + New Category
          </button>
        </div>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div
              className={`col-span-full p-12 text-center rounded-xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
            >
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mb-2"></div>
              <p
                className={`text-sm ${dark ? "text-slate-300" : "text-gray-600"}`}
              >
                Loading categories...
              </p>
            </div>
          ) : budgets.length === 0 ? (
            <div
              className={`col-span-full p-12 text-center rounded-xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
            >
              <p
                className={`text-sm ${dark ? "text-slate-300" : "text-gray-600"}`}
              >
                No categories yet
              </p>
              <button
                onClick={() => setModal({ open: true, data: null })}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 hover:underline"
              >
                Create your first category →
              </button>
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

        {/* Budget Overview Chart */}
        {!loading && budgets.length > 0 && (
          <div
            className={`rounded-xl border p-4 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <h3
              className={`font-semibold mb-4 text-sm uppercase tracking-wide flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}
            >
              <PieIcon size={16} className="text-blue-500" /> Budget
              Distribution
            </h3>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    minAngle={15}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={true}
                    fontSize={11}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={dark ? "#1e293b" : "#fff"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "12px",
                      backgroundColor: dark ? "#1e293b" : "#fff",
                      borderColor: dark ? "#334155" : "#e5e7eb",
                      color: dark ? "#fff" : "#111",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ 
                      fontSize: "11px",
                      paddingTop: "20px"
                    }}
                    formatter={(value) => (
                      <span
                        className={`${dark ? "text-slate-200" : "text-gray-700"}`}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Modal */}
        {modal.open && (
          <CategoryModal
            onClose={() => setModal({ open: false, data: null })}
            onRefresh={loadData}
            editingCategory={modal.data}
          />
        )}
      </div>
    </div>
  );
};

export default Budgets;
