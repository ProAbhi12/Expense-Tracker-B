import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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
} from "lucide-react";

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
} from "recharts";

import { useTheme } from "../context/ThemeContext";
import { useApp } from "../context/AppContext";

const BASE_URL = "https://localhost:7197/api/Category";

// ================= TYPE MAP =================
const mapCategoryType = (type) => {
  switch (type) {
    case 1:
      return "INCOME";
    case 2:
      return "EXPENSE";
    default:
      return "EXPENSE";
  }
};

// ================= ICON LOGIC =================
const getIcon = (name = "") => {
  const n = name.toLowerCase();

  if (n.includes("food")) return UtensilsCrossed;
  if (n.includes("transport")) return Car;
  if (n.includes("home") || n.includes("rent")) return Home;
  if (n.includes("movie")) return Film;
  if (n.includes("shop")) return ShoppingCart;
  if (n.includes("light") || n.includes("bill")) return Lightbulb;
  if (n.includes("health")) return Heart;
  if (n.includes("book")) return BookOpen;

  return Receipt;
};

// ================= HELPERS =================
const formatCurrency = (v) => `Rs. ${Number(v || 0).toLocaleString()}`;

const trendMultipliers = {
  daily: 0.08,
  weekly: 0.35,
  monthly: 1,
  yearly: 12,
};

// ================= CARD =================
const BudgetCard = ({ item, onDelete }) => {
  const { dark } = useTheme();
  const { getSpentByCategory } = useApp();

  const spent = getSpentByCategory(item?.name || "");
  const remaining = (item?.budget || 0) - spent;
  const percent = item?.budget
    ? Math.min((spent / item.budget) * 100, 100)
    : 0;

  const Icon = getIcon(item?.name);

  return (
    <div className={`p-4 rounded-xl border ${dark ? "bg-slate-900" : "bg-white"}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon size={18} />
          <h3 className="font-bold">{item?.name}</h3>
        </div>

        <Trash2
          size={16}
          className="cursor-pointer text-red-500"
          onClick={() => onDelete(item.id)}
        />
      </div>

      <div className="h-2 bg-gray-200 mt-3 rounded">
        <div
          className="h-2 bg-blue-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-xs mt-2">
        <span>{Math.round(percent)}%</span>
        <span className={remaining < 0 ? "text-red-500" : "text-green-600"}>
          {formatCurrency(remaining)}
        </span>
      </div>
    </div>
  );
};

// ================= MAIN =================
const Budgets = () => {
  const { dark } = useTheme();

  const [budgets, setBudgets] = useState([]);
  const [trendRange, setTrendRange] = useState("monthly");

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(BASE_URL);

        const mapped = res.data.map((c) => ({
          id: c.id,
          name: c.name || "Unknown",
          budget: c.budget || 0,
          color: c.color || "#3b82f6",
          type: mapCategoryType(c.type),
        }));

        setBudgets(mapped);
      } catch (err) {
        console.log("API error:", err);
      }
    };

    fetchData();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setBudgets((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CHART DATA =================
  const chartData = budgets.map((b) => ({
    name: b.name,
    value: b.budget,
    color: b.color,
  }));

  const trendData = budgets.map((b) => ({
    label: b.name,
    value: b.budget * trendMultipliers[trendRange],
  }));

  return (
    <div className="p-4 space-y-6">

      <h2 className="text-2xl font-bold">Budgets</h2>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        {budgets.map((item) => (
          <BudgetCard
            key={item.id}
            item={item}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

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
            <Tooltip />
            <Line dataKey="value" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
};

export default Budgets;