import React, { useEffect, useState } from "react";
import axios from "axios";
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

// ================= API =================
const BASE_URL = "https://localhost:7197/api/Category";

// ================= CONSTANTS =================
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

const trendMultipliers = {
  daily: 0.08,
  weekly: 0.35,
  monthly: 1,
  yearly: 12,
};

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

// ================= ICON HELPERS =================
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
  const name = categoryName.toLowerCase();

  if (["car", "bike", "taxi"].some((k) => name.includes(k)))
    return { icon: Car, color: "#3b82f6" };

  if (["food", "restaurant", "meal"].some((k) => name.includes(k)))
    return { icon: UtensilsCrossed, color: "#ef4444" };

  if (["light", "wifi", "bill"].some((k) => name.includes(k)))
    return { icon: Lightbulb, color: "#06b6d4" };

  if (["movie", "game"].some((k) => name.includes(k)))
    return { icon: Film, color: "#10b981" };

  if (["gym", "health"].some((k) => name.includes(k)))
    return { icon: Heart, color: "#ec4899" };

  if (["shopping", "clothes"].some((k) => name.includes(k)))
    return { icon: ShoppingCart, color: "#8b5cf6" };

  if (["home", "rent"].some((k) => name.includes(k)))
    return { icon: Home, color: "#f59e0b" };

  return { icon: BookOpen, color: "#9ca3af" };
};

// ================= ADD MODAL =================
const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
  const { dark } = useTheme();

  const [form, setForm] = useState({
    category: "Food",
    budget: "",
    color: "#ef4444",
    type: "EXPENSE",
  });

  const onSubmit = () => {
    const amount = parseFloat(form.budget);

    if (!form.category || isNaN(amount) || amount <= 0) return;

    addBudget({ ...form, budget: amount });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md p-6 rounded-xl ${
          dark ? "bg-slate-900 text-white" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Add Category</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <input
          className="w-full p-2 border mb-3"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          className="w-full p-2 border mb-3"
          placeholder="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// ================= CARD =================
const BudgetCard = ({ budget }) => {
  const { deleteBudget, getSpentByCategory } = useApp();
  const { dark } = useTheme();

  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const percent = Math.min((spent / budget.budget) * 100, 100);

  return (
    <div className={`p-4 rounded-xl border ${dark ? "bg-slate-900" : ""}`}>
      <div className="flex justify-between">
        <h3>{budget.category}</h3>
        <Trash2 onClick={() => deleteBudget(budget.id)} />
      </div>

      <div className="h-2 bg-gray-200 mt-2">
        <div
          className="h-2 bg-blue-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm mt-2">
        Left: {formatCurrency(remaining)}
      </p>
    </div>
  );
};

// ================= MAIN =================
const Budgets = () => {

  const { dark } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [trendRange, setTrendRange] = useState("monthly");

  // ===== API FETCH (ONLY GET, NOT DISPLAYED) =====
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(BASE_URL);
        setBudgets(res.data);
        console.log("Fetched budgets:", res.data);
      } catch (err) {
        console.log("Budget API error:", err);
      }
    };

    fetchCategories();
  }, []);

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
    <div className="p-4 space-y-6">

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        <Plus /> Add Category
      </button>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {budgets.map((b) => (
          <BudgetCard key={b.id} budget={b} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value">
              {chartData.map((c, i) => (
                <Cell key={i} fill={c.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Line dataKey="value" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showModal && (
        <AddBudgetModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Budgets;