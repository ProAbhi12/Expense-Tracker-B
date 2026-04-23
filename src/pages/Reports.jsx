import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import sharedTransactions from "../dummyData/transactions.json";

const COLORS = ["#06b6d4", "#f43f5e"];
const CATEGORY_COLORS = ["#8b5cf6", "#f97316", "#22c55e", "#3b82f6", "#ec4899", "#eab308", "#14b8a6", "#6366f1"];

const CustomPieTooltip = ({ active, payload, formatCurrency, dark, gradient }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className={`rounded-lg border shadow-md px-3 py-2 text-sm ${gradient ? "bg-slate-900/95 border-purple-700/50" : dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
      <p className={`font-semibold ${gradient ? "text-purple-100" : dark ? "text-slate-100" : "text-gray-700"}`}>{item.name}</p>
      <p className={gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}>{formatCurrency(item.value)}</p>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label, formatCurrency, dark, gradient }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={`rounded-lg border shadow-md px-3 py-2 text-sm ${gradient ? "bg-slate-900/95 border-purple-700/50" : dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
      <p className={`font-semibold mb-1 ${gradient ? "text-purple-100" : dark ? "text-slate-100" : "text-gray-700"}`}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className={gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const Reports = () => {
  const { dark, gradient } = useTheme();

  // ---------- Helper Functions ----------
  const formatCurrency = (value) => {
    if (value >= 1_000_000) return `Rs.${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `Rs.${(value / 1_000).toFixed(1)}K`;
    return `Rs.${value}`;
  };

  const formatChartLabel = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return `${value}`;
  };

  const getFinancialData = (transactions) => {
    const income = transactions
      .filter((tx) => tx.type === "INCOME")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions
      .filter((tx) => tx.type === "EXPENSE")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const byCategory = transactions
      .filter((tx) => tx.type === "EXPENSE")
      .reduce((acc, tx) => {
        const cat = typeof tx.category === "object" ? tx.category?.name : tx.category;
        const key = cat || "Other";
        acc[key] = (acc[key] || 0) + tx.amount;
        return acc;
      }, {});
    return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses, expensesByCategory: byCategory };
  };

  const transactions = Array.isArray(sharedTransactions) ? sharedTransactions : [];
  const { totalIncome, totalExpenses, netBalance, expensesByCategory } = getFinancialData(transactions);

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  const barData = [{ name: "Total", Income: totalIncome, Expenses: totalExpenses }];
  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  const hasExpenses = categoryData.length > 0;
  const chartSurfaceClass = gradient
    ? "bg-slate-900/50 border-purple-700/40 backdrop-blur-sm"
    : dark
    ? "bg-slate-900 border-slate-700"
    : "bg-white/80 border-gray-200";
  const chartTitleClass = gradient ? "text-purple-100" : dark ? "text-slate-100" : "text-gray-800";
  const chartGridStroke = gradient ? "#6d28d9" : dark ? "#334155" : "#e5e7eb";
  const chartAxisStroke = gradient ? "#c4b5fd" : dark ? "#94a3b8" : "#6b7280";
  const legendColor = gradient ? "#e9d5ff" : dark ? "#e2e8f0" : "#374151";

  return (
    <div className={`p-8 space-y-8 ${gradient ? "bg-gradient-to-br from-[#1a0f3f] via-[#2d1b4e] to-[#1a0f3f]" : dark ? "bg-slate-900 min-h-screen" : ""}`}>
      <h1 className={`text-3xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Income Card */}
        <div className={`border-l-4 border-green-500 p-6 rounded-lg ${gradient ? "bg-green-900/30" : dark ? "bg-green-900/20" : "bg-green-50"}`}>
          <h3 className={`font-medium ${gradient ? "text-green-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Total Income</h3>
          <p className="text-3xl font-bold text-green-500">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Expense Card */}
        <div className={`border-l-4 border-red-500 p-6 rounded-lg ${gradient ? "bg-red-900/30" : dark ? "bg-red-900/20" : "bg-red-50"}`}>
          <h3 className={`font-medium ${gradient ? "text-red-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Total Expenses</h3>
          <p className="text-3xl font-bold text-red-500">
            Rs. {totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* Balance Card */}
        <div
          className={`border-l-4 p-6 rounded-lg ${netBalance >= 0 ? "border-blue-500" : "border-orange-500"} ${gradient ? "bg-blue-900/30" : dark ? "bg-blue-900/20" : "bg-blue-50"}`}
        >
          <h3 className={`font-medium ${gradient ? "text-blue-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Net Balance</h3>
          <p
            className={`text-3xl font-bold ${netBalance >= 0 ? "text-blue-500" : "text-orange-500"}`}
          >
            Rs. {netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className={`border rounded-lg p-6 ${gradient ? "bg-slate-900/40 border-purple-700/40 backdrop-blur-sm shadow-[0_8px_24px_rgba(147,51,234,0.15)]" : dark ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "bg-white border-gray-200"}`}>
        <h2 className={`text-xl font-bold mb-4 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
          Expense Breakdown by Category
        </h2>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div
              key={category}
              className={`flex justify-between items-center p-3 rounded ${gradient ? "bg-purple-600/20" : dark ? "bg-slate-800" : "bg-gray-50"}`}
            >
              <span className={gradient ? "text-purple-100" : dark ? "text-slate-300" : "text-gray-700"}>{category}</span>
              <span className={`font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
                Rs. {amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Income vs Expenses Pie Chart */}
          <div className={`rounded-2xl shadow-lg p-4 border ${chartSurfaceClass}`}>
            <h2 className={`text-lg font-bold mb-3 ${chartTitleClass}`}>Income vs Expenses Distribution</h2>
            <ResponsiveContainer width="100%" height={340}>
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}\n${formatChartLabel(value)}`}
                  outerRadius={90}
                  dataKey="value"
                  animationDuration={1000}
                  fontSize={10}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip formatCurrency={formatCurrency} dark={dark} gradient={gradient} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart Comparison */}
          <div className={`rounded-2xl shadow-lg p-4 border ${chartSurfaceClass}`}>
            <h2 className={`text-lg font-bold mb-3 ${chartTitleClass}`}>Financial Comparison</h2>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
                <XAxis dataKey="name" stroke={chartAxisStroke} fontSize={11} />
                <YAxis tickFormatter={(v) => formatChartLabel(v)} stroke={chartAxisStroke} fontSize={10} width={40} />
                <Tooltip content={<CustomBarTooltip formatCurrency={formatCurrency} dark={dark} gradient={gradient} />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px", color: legendColor }} />
                <Bar dataKey="Income" fill="#06b6d4" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Category List */}
          <div className={`rounded-2xl shadow-lg p-4 border ${chartSurfaceClass}`}>
            <h2 className={`text-lg font-bold mb-3 ${chartTitleClass}`}>Expense Categories</h2>
            {!hasExpenses ? (
              <p className={`${gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"} text-center py-8`}>No expenses recorded yet.</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {Object.entries(expensesByCategory).map(([category, amount], idx) => (
                  <li
                    key={category}
                    className={`flex justify-between items-center p-2 rounded-lg transition-all hover:translate-x-1 text-sm ${gradient ? "bg-purple-900/25 border border-purple-700/40 hover:border-purple-400" : dark ? "bg-slate-800 border border-slate-700 hover:border-slate-500" : "bg-gray-50 border border-gray-200 hover:border-purple-300"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                      />
                      <span className={`${gradient ? "text-purple-100" : dark ? "text-slate-200" : "text-gray-700"} font-medium truncate`}>{category}</span>
                    </div>
                    <span
                      className="font-bold whitespace-nowrap"
                      style={{ color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    >
                      {formatChartLabel(amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Category Pie Chart */}
          <div className={`rounded-2xl shadow-lg p-4 border ${chartSurfaceClass}`}>
            <h2 className={`text-lg font-bold mb-3 ${chartTitleClass}`}>Category Breakdown</h2>
            {!hasExpenses ? (
              <p className={`${gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"} text-center py-8`}>No expense data to display.</p>
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}\n${formatChartLabel(value)}`}
                    outerRadius={90}
                    dataKey="value"
                    animationDuration={1000}
                    fontSize={9}
                  >
                    {categoryData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip formatCurrency={formatCurrency} dark={dark} gradient={gradient} />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
