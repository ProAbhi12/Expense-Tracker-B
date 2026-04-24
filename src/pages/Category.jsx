import React, { useState } from "react";
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

// ========== CONSTANTS & HELPERS ==========
const CATEGORY_OPTIONS = [
  { category: "Food", color: "#ef4444" },
  { category: "Transportation", color: "#3b82f6" },
  { category: "Housing", color: "#f59e0b" },
  { category: "Entertainment", color: "#10b981" },
  { category: "Shopping", color: "#8b5cf6" },
  { category: "Utilities", color: "#06b6d4" },
  { category: "Health", color: "#ec4899" },
  { category: "Gym", color: "#7c3aed" },
  { category: "Education", color: "#f97316" },
];

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
const trendMultipliers = { daily: 0.08, weekly: 0.35, monthly: 1, yearly: 12 };

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

const getIconComponent = (categoryName) => {
  const iconMap = {
    Food: UtensilsCrossed,
    Transportation: Car,
    Housing: Home,
    Entertainment: Film,
    Shopping: ShoppingCart,
    Utilities: Lightbulb,
    Health: Heart,
    Gym: Heart,
    Education: BookOpen,
  };
  return iconMap[categoryName] || Receipt;
};

const getSmartIconForCustom = (categoryName) => {
  const name = categoryName.toLowerCase().trim();
  if (["petrol", "gas", "car", "bike", "taxi"].some((k) => name.includes(k)))
    return { icon: Car, color: "#3b82f6" };
  if (
    ["food", "grocery", "eat", "meal", "restaurant"].some((k) =>
      name.includes(k),
    )
  )
    return { icon: UtensilsCrossed, color: "#ef4444" };
  if (["bill", "wifi", "phone", "light"].some((k) => name.includes(k)))
    return { icon: Lightbulb, color: "#06b6d4" };
  if (["movie", "game", "fun", "party"].some((k) => name.includes(k)))
    return { icon: Film, color: "#10b981" };
  if (["gym", "health", "doctor", "medicine"].some((k) => name.includes(k)))
    return { icon: Heart, color: "#ec4899" };
  if (["shopping", "buy", "clothes", "mall"].some((k) => name.includes(k)))
    return { icon: ShoppingCart, color: "#8b5cf6" };
  if (["rent", "home", "house", "room"].some((k) => name.includes(k)))
    return { icon: Home, color: "#f59e0b" };
  return { icon: BookOpen, color: "#9ca3af" };
};

// ========== ADD BUDGET MODAL COMPONENT ==========
const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
  const { dark } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(
    CATEGORY_OPTIONS[0].category,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: CATEGORY_OPTIONS[0].category,
    budget: "",
    color: CATEGORY_OPTIONS[0].color,
    type: "EXPENSE", // Default to Expense
  });

  const onSubmit = () => {
    const amount = parseFloat(form.budget.toString().replace(/,/g, ""));
    if (!form.category.trim()) return setError("Please enter a name");
    if (isNaN(amount) || amount <= 0)
      return setError("Please enter a valid amount");
    addBudget({ ...form, budget: amount });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-xl border shadow-xl ${dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-gray-200 bg-white text-gray-800"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Type Switcher (Matching Backend) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
              Flow Type
            </label>
            <div
              className={`flex p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-gray-100"}`}
            >
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "EXPENSE" })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${form.type === "EXPENSE" ? "bg-red-600 text-white shadow-md" : "text-gray-500"}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "INCOME" })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${form.type === "INCOME" ? "bg-green-600 text-white shadow-md" : "text-gray-500"}`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 px-1">
              Select Category
            </label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-full p-3 border rounded-lg flex justify-between items-center text-sm font-medium transition-all ${
                dropdownOpen
                  ? "border-blue-500 ring-2 ring-blue-500/10"
                  : dark
                    ? "border-slate-700 bg-slate-800"
                    : "border-gray-300 bg-white"
              }`}
            >
              <span className="flex items-center gap-3">
                {selectedPreset === "custom" ? (
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded">
                    ✨
                  </div>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                    {React.createElement(getIconComponent(selectedPreset), {
                      size: 14,
                    })}
                  </div>
                )}
                {selectedPreset === "custom"
                  ? "Custom Category"
                  : selectedPreset}
              </span>
              <span
                className={`text-xs transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {dropdownOpen && (
              <div
                className={`absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border shadow-2xl overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
              >
                <div className="max-h-60 overflow-y-auto p-1.5 grid grid-cols-1 gap-1">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.category}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(opt.category);
                        setForm({
                          ...form,
                          category: opt.category,
                          color: opt.color,
                        });
                        setDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 text-left rounded-lg text-sm flex items-center gap-3 transition-colors ${
                        selectedPreset === opt.category
                          ? "bg-blue-600 text-white shadow-md"
                          : dark
                            ? "hover:bg-slate-700 text-slate-300"
                            : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${selectedPreset === opt.category ? "bg-white/20" : "bg-slate-100 dark:bg-slate-600"}`}
                      >
                        {React.createElement(getIconComponent(opt.category), {
                          size: 12,
                        })}
                      </div>
                      <span className="font-semibold">{opt.category}</span>
                    </button>
                  ))}
                  <div className="h-px bg-gray-100 dark:bg-slate-700 my-1 mx-2"></div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPreset("custom");
                      setForm({ ...form, category: "" });
                      setDropdownOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-sm text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-3"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
                      ✨
                    </div>
                    Create Custom
                  </button>
                </div>
              </div>
            )}
          </div>

          {selectedPreset === "custom" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Category Name
              </label>
              <input
                value={form.category}
                maxLength={20}
                onChange={(e) => {
                  const smart = getSmartIconForCustom(e.target.value);
                  setForm({
                    ...form,
                    category: e.target.value,
                    color: smart.color,
                  });
                }}
                className={`w-full p-2.5 border rounded-lg text-sm ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-300"}`}
                placeholder="e.g. Petrol, Gym..."
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Budget Amount (Rs.)
            </label>
            <input
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className={`w-full p-2.5 border rounded-lg text-sm font-medium ${dark ? "bg-slate-800 border-slate-700 text-white" : "border-gray-300"}`}
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg dark:border-slate-700">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`h-6 w-6 rounded-full border-2 ${form.color === c ? "border-gray-900 dark:border-white scale-110" : "border-transparent opacity-60"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== BUDGET CARD COMPONENT ==========
const BudgetCard = ({ budget }) => {
  const { getSpentByCategory, deleteBudget } = useApp();
  const { dark } = useTheme();

  // Stability Fix: Use Icon directly from map
  const smart = getSmartIconForCustom(budget.category);
  const isPreset = CATEGORY_OPTIONS.some((c) => c.category === budget.category);

  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const percentage = Math.min((spent / budget.budget) * 100, 100);

  return (
    <div
      className={`rounded-2xl border p-5 transition hover:shadow-md ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl shadow-sm"
            style={{
              backgroundColor: `${budget.color}15`,
              color: budget.color,
            }}
          >
            {React.createElement(
              isPreset ? getIconComponent(budget.category) : smart.icon,
              { size: 20 },
            )}
          </div>
          <div>
            <h3
              className={`font-bold ${dark ? "text-white" : "text-slate-900"}`}
            >
              {budget.category}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Budget: {formatCurrency(budget.budget)}
            </p>
          </div>
        </div>
        <button
          onClick={() => deleteBudget(budget.id)}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div
        className={`h-2.5 w-full rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}
      >
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, background: budget.color }}
        />
      </div>
      <div className="flex justify-between mt-3 text-xs font-bold">
        <span className="opacity-60">{Math.round(percentage)}% used</span>
        <span
          className={
            remaining < 0 ? "text-red-500 animate-pulse" : "text-green-600"
          }
        >
          {remaining < 0
            ? `Rs. ${Math.abs(remaining)} over!`
            : `${formatCurrency(remaining)} left`}
        </span>
      </div>
    </div>
  );
};

// ========== MAIN PAGE ==========
const Budgets = () => {
  const { budgets } = useApp();
  const { dark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [trendRange, setTrendRange] = useState("monthly");

  const axisStroke = dark ? "#94a3b8" : "#64748b";
  const gridStroke = dark ? "#334155" : "#e2e8f0";

  const chartData = budgets.map((b) => ({
    name: b.category,
    value: b.budget,
    color: b.color,
  }));
  const trendData = budgets.map((b) => ({
    label: b.category,
    value: b.budget * trendMultipliers[trendRange],
  }));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className={`text-2xl sm:text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}
          >
            Budget Categories
          </h2>
          <p className="text-sm opacity-60 font-medium">
            Manage your spending limits and distributions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => (
          <BudgetCard key={b.id} budget={b} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`rounded-2xl border p-6 shadow-sm ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <h3
            className={`font-bold mb-6 flex items-center gap-2 underline decoration-blue-500 decoration-4 underline-offset-8 ${dark ? "text-white" : ""}`}
          >
            Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`rounded-2xl border p-6 shadow-sm ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`font-bold underline decoration-green-500 decoration-4 underline-offset-8 ${dark ? "text-white" : ""}`}
            >
              Trend Analysis
            </h3>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
              {["daily", "weekly", "monthly", "yearly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTrendRange(r)}
                  className={`px-2 py-1 text-[9px] font-black rounded uppercase transition-all ${trendRange === r ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={gridStroke}
                />
                <XAxis
                  dataKey="label"
                  stroke={axisStroke}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis
                  stroke={axisStroke}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Budget"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Budgets;
