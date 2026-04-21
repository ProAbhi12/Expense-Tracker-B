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
const INCOLORS = ["#22c55e", "#ef4444"];

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
  return `Rs. ${amount.toLocaleString()}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NP", {
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
  { id: 1, description: "Grocery Store", category: "Food", amount: 284.5, type: "expense", date: "2026-04-18" },
  { id: 2, description: "Salary Deposit", category: "Income", amount: 42500.0, type: "income", date: "2026-04-15" },
  { id: 3, description: "Netflix", category: "Entertainment", amount: 499.0, type: "expense", date: "2026-04-14" },
  { id: 4, description: "Coffee", category: "Food", amount: 150.0, type: "expense", date: "2026-04-17" },
];

const totalIncome = 45000;
const totalExpense = 12500;
const balance = 32500;
const expenseChange = { percent: "2.5", isDecrease: true };

// ============================================
// TRANSACTION LIST COMPONENT (Read Only)
// ============================================
const TransactionList = ({ dark }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${dark ? "bg-slate-900 border-slate-700 shadow-lg" : "bg-white border-gray-200 shadow-sm"}`}>
      <div className={`p-4 border-b ${dark ? "border-slate-700" : "border-gray-100"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className={`font-bold flex items-center gap-2 ${dark ? "text-slate-100" : "text-gray-800"}`}>    
            <CreditCard size={18} className="text-blue-500" />
            Recent Transactions
          </h3>

          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-200 text-gray-800"}`}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200 text-gray-800"}`}
            >
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`divide-y ${dark ? "divide-slate-700" : "divide-gray-100"}`}>   
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className={`p-4 transition ${dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === "expense" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {transaction.type === "expense" ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className={`font-medium ${dark ? "text-slate-100" : "text-gray-800"}`}>{transaction.description}</p>
                  <p className="text-xs text-gray-400">{transaction.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                {transaction.type === "expense" ? "-" : "+"} {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// TREND DATA BY RANGE
// ============================================
const trendDataByRange = {
  monthly: [
    { date: "Week 1", value: 450 },
    { date: "Week 2", value: 380 },
    { date: "Week 3", value: 520 },
    { date: "Week 4", value: 490 },
  ],
  weekly: [
    { date: "Mon", value: 120 },
    { date: "Tue", value: 180 },
    { date: "Wed", value: 150 },
    { date: "Thu", value: 200 },
    { date: "Fri", value: 220 },
    { date: "Sat", value: 280 },
    { date: "Sun", value: 160 },
  ],
  yearly: [
    { date: "Jan", value: 1200 },
    { date: "Feb", value: 1400 },
    { date: "Mar", value: 1100 },
    { date: "Apr", value: 1840 },
  ],
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const Dashboard = () => {
  const { dark } = useTheme();
  const [trendRange, setTrendRange] = useState("monthly");
  const axisStroke = dark ? "#94a3b8" : "#64748b";
  const gridStroke = dark ? "#334155" : "#e2e8f0";
  const trendData = trendDataByRange[trendRange];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Dashboard</h1>     
          <p className={dark ? "text-slate-400" : "text-gray-500"}>Welcome back! Here's your financial summary.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg shadow-blue-600/20">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <Wallet size={20} />
          </div>
          <h3 className="text-3xl font-bold">{formatCurrency(balance)}</h3>
          <div className="mt-4 flex items-center text-blue-100 text-xs font-medium">
            <TrendingUp size={14} className="mr-1" />
            <span>+2.5% from last week</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Monthly Income</p>
            <ArrowUpRight size={20} className="text-green-500" />
          </div>
          <h3 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>{formatCurrency(totalIncome)}</h3>
          <p className="text-green-600 text-xs font-bold mt-2">+ Rs. 5,000</p>
        </div>

        <div className={`p-6 rounded-xl border ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Monthly Expenses</p>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <h3 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>{formatCurrency(totalExpense)}</h3>
          <p className="text-red-600 text-xs font-bold mt-2">- Rs. 1,200</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${dark ? "bg-slate-900 border-slate-700 shadow-lg" : "bg-white border-gray-200 shadow-sm"}`}>
          <h3 className={`font-bold mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}>Income vs Expense</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" label={renderPercentLabel} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INCOLORS[index % INCOLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${dark ? "bg-slate-900 border-slate-700 shadow-lg" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Financial Trend</h3>
            <div className="flex gap-1">
              {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                <button key={range} onClick={() => setTrendRange(range)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition ${trendRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="label" stroke={axisStroke} tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                <YAxis stroke={axisStroke} tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <TransactionList dark={dark} />
    </div>
  );
};

export default Dashboard;
