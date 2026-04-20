import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  TrendingUp,
  Calendar,
  Search,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

// ============================================
// HELPER FUNCTIONS
// ============================================

const data = [
  { name: "Income", value: 10000 },
  { name: "Expense", value: 5000 },

];

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;
const INCOLORS = ["#03a900", "#e20000"];

const trendDataByRange = {
  daily: [
    { label: "Mon", income: 420, expense: 310 },
    { label: "Tue", income: 580, expense: 360 },
    { label: "Wed", income: 460, expense: 420 },
    { label: "Thu", income: 620, expense: 390 },
    { label: "Fri", income: 710, expense: 520 },
    { label: "Sat", income: 680, expense: 610 },
    { label: "Sun", income: 540, expense: 470 },
  ],
  weekly: [
    { label: "W1", income: 3200, expense: 2400 },
    { label: "W2", income: 3600, expense: 2700 },
    { label: "W3", income: 3400, expense: 2900 },
    { label: "W4", income: 3900, expense: 3050 },
  ],
  monthly: [
    { label: "Jan", income: 8200, expense: 6100 },
    { label: "Feb", income: 8700, expense: 6400 },
    { label: "Mar", income: 9100, expense: 6800 },
    { label: "Apr", income: 9400, expense: 7200 },
    { label: "May", income: 9800, expense: 7600 },
    { label: "Jun", income: 10200, expense: 7900 },
  ],
  yearly: [
    { label: "2022", income: 86000, expense: 61000 },
    { label: "2023", income: 93000, expense: 68000 },
    { label: "2024", income: 101000, expense: 74000 },
    { label: "2025", income: 108000, expense: 81000 },
    { label: "2026", income: 116000, expense: 88000 },
  ],
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getCategoryColor = (category) => {
  const colors = {
    Food: "#f59e0b",
    Shopping: "#8b5cf6",
    Transport: "#3b82f6",
    Entertainment: "#ec489a",
    Utilities: "#10b981",
    Health: "#ef4444",
    Home: "#6366f1",
    Coffee: "#d97706",
    Income: "#06b6d4",
  };
  return colors[category] || "#6b7280";
};

// ============================================
// TRANSACTION DATA
// ============================================
const transactions = [
  {
    id: 1,
    description: "Grocery Store - Supermart",
    category: "Food",
    amount: 284.5,
    type: "expense",
    date: "2026-04-18T00:00:00Z",
  },
  {
    id: 2,
    description: "Salary Deposit",
    category: "Income",
    amount: 4250.0,
    type: "income",
    date: "2026-04-15T00:00:00Z",
  },
  {
    id: 3,
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    type: "expense",
    date: "2026-04-14T00:00:00Z",
  },
  {
    id: 4,
    description: "Starbucks Coffee",
    category: "Coffee",
    amount: 8.45,
    type: "expense",
    date: "2026-04-17T00:00:00Z",
  },
  {
    id: 5,
    description: "Electric Bill",
    category: "Utilities",
    amount: 124.2,
    type: "expense",
    date: "2026-04-12T00:00:00Z",
  },
  {
    id: 6,
    description: "Freelance Project",
    category: "Income",
    amount: 850.0,
    type: "income",
    date: "2026-04-10T00:00:00Z",
  },
  {
    id: 7,
    description: "New Jeans",
    category: "Shopping",
    amount: 89.99,
    type: "expense",
    date: "2026-04-09T00:00:00Z",
  },
  {
    id: 8,
    description: "Dinner with Friends",
    category: "Food",
    amount: 67.3,
    type: "expense",
    date: "2026-04-16T00:00:00Z",
  },
  {
    id: 9,
    description: "Gym Membership",
    category: "Health",
    amount: 55.0,
    type: "expense",
    date: "2026-04-05T00:00:00Z",
  },
  {
    id: 10,
    description: "Mobile Recharge",
    category: "Utilities",
    amount: 49.99,
    type: "expense",
    date: "2026-04-07T00:00:00Z",
  },
  {
    id: 11,
    description: "Uber Rides",
    category: "Transport",
    amount: 32.5,
    type: "expense",
    date: "2026-04-11T00:00:00Z",
  },
  {
    id: 12,
    description: "Movie Ticket",
    category: "Entertainment",
    amount: 24.75,
    type: "expense",
    date: "2026-04-13T00:00:00Z",
  },
  {
    id: 13,
    description: "Amazon Purchase",
    category: "Shopping",
    amount: 45.99,
    type: "expense",
    date: "2026-04-08T00:00:00Z",
  },
  {
    id: 14,
    description: "Rent Payment",
    category: "Home",
    amount: 1200.0,
    type: "expense",
    date: "2026-04-01T00:00:00Z",
  },
];

// Calculate totals
const calculateTotals = () => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
};

const { totalIncome, totalExpense, balance } = calculateTotals();

// Monthly comparison (mock data for demo)
const getMonthlyChange = () => {
  const lastMonthExpense = 1280;
  const change = totalExpense - lastMonthExpense;
  const percentChange = (change / lastMonthExpense) * 100;
  return {
    amount: Math.abs(change),
    percent: Math.abs(percentChange).toFixed(1),
    isDecrease: change < 0,
  };
};

const expenseChange = getMonthlyChange();

// ============================================
// TRANSACTION LIST COMPONENT (Read Only)
// ============================================
const TransactionList = ({ dark }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        dark
          ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className={`p-4 border-b ${dark ? "border-slate-700" : "border-gray-100"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className={`font-bold flex items-center gap-2 ${dark ? "text-slate-100" : "text-gray-800"}`}>
            <CreditCard size={18} className="text-blue-500" />
            Recent Transactions
          </h3>

          <div className="flex gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                dark
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`divide-y max-h-96 overflow-y-auto ${dark ? "divide-slate-700" : "divide-gray-100"}`}>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-4 transition ${dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor:
                        transaction.type === "expense" ? "#fee2e2" : "#d1fae5",
                      color:
                        transaction.type === "expense" ? "#dc2626" : "#10b981",
                    }}
                  >
                    {transaction.type === "expense" ? (
                      <ArrowDownRight size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${dark ? "text-slate-100" : "text-gray-800"}`}>
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs flex items-center gap-1 ${dark ? "text-slate-400" : "text-gray-400"}`}>
                        <Calendar size={10} />
                        {formatDate(transaction.date)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${getCategoryColor(
                            transaction.category
                          )}15`,
                          color: getCategoryColor(transaction.category),
                        }}
                      >
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      transaction.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const Dashboard = () => {
  const { dark } = useTheme();
  const [trendRange, setTrendRange] = useState("monthly");
  const cardShadowClasses = dark
    ? "shadow-[0_8px_24px_rgba(148,163,184,0.12)] hover:shadow-[0_12px_30px_rgba(148,163,184,0.18)]"
    : "shadow-sm hover:shadow-md";
  const axisStroke = dark ? "#94a3b8" : "#64748b";
  const gridStroke = dark ? "#334155" : "#e2e8f0";
  const trendData = trendDataByRange[trendRange];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Dashboard</h1>
          <p className={`mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}>
            Welcome back! Here's your financial summary.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div
          className={`bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white transition ${
            dark
              ? "shadow-[0_10px_28px_rgba(96,165,250,0.28)] hover:shadow-[0_14px_34px_rgba(96,165,250,0.36)]"
              : "shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <Wallet size={20} className="text-blue-100" />
          </div>
          <h3 className="text-3xl font-bold">{formatCurrency(balance)}</h3>
          <div className="mt-4 flex items-center text-blue-100 text-xs">
            <TrendingUp size={14} className="mr-1" />
            <span>Income - Expenses</span>
          </div>
        </div>

        {/* Income Card */}
        <div
          className={`p-6 rounded-xl border transition ${cardShadowClasses} ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>Monthly Income</p>
            <ArrowUpRight size={20} className="text-green-500" />
          </div>
          <h3 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
            {formatCurrency(totalIncome)}
          </h3>
          <p className="text-green-600 text-xs font-medium mt-2">
            Total this month
          </p>
        </div>

        {/* Expense Card */}
        <div
          className={`p-6 rounded-xl border transition ${cardShadowClasses} ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>
              Monthly Expenses
            </p>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <h3 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
            {formatCurrency(totalExpense)}
          </h3>
          <p
            className={`text-xs font-medium mt-2 ${
              expenseChange.isDecrease ? "text-green-600" : "text-red-600"
            }`}
          >
            {expenseChange.isDecrease ? "↓" : "↑"} {expenseChange.percent}% from
            last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-xl border transition ${cardShadowClasses} ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
                Income vs Expense
              </h3>
              <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}>
                Distribution for this month
              </p>
            </div>
            <TrendingUp size={18} className="text-blue-500" />
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  label={renderPercentLabel}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={INCOLORS[index % INCOLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => {
                    const total = data.reduce((sum, e) => sum + e.value, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return [`${formatCurrency(value)} (${percent}%)`, name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`p-6 rounded-xl border transition ${cardShadowClasses} ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
                Income vs Expense Trend
              </h3>
              <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}>
                Daily / Weekly / Monthly / Yearly
              </p>
            </div>
            <TrendingUp size={18} className="text-blue-500" />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: "daily", label: "Daily" },
              { key: "weekly", label: "Weekly" },
              { key: "monthly", label: "Monthly" },
              { key: "yearly", label: "Yearly" },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTrendRange(range.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  trendRange === range.key
                    ? "bg-blue-600 border-blue-600 text-white"
                    : dark
                      ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 8, right: 18, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="label" stroke={axisStroke} tickLine={false} axisLine={false} />
                <YAxis stroke={axisStroke} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [formatCurrency(value), name]} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction List - Full Width (Read Only) */}
      <div>
        <TransactionList dark={dark} />
      </div>
    </div>
  );
};

export default Dashboard;
