import React, { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import sharedTransactions from "../dummyData/transactions.json";
import trendDataByRange from "../dummyData/dashboardTrendData.json";

const transactions = sharedTransactions.map((item) => ({
  ...item,
  description: item.name,
}));

const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
  return colors[category] || "#64748b";
};

const TransactionList = ({ dark, gradient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const sortedTransactions = useMemo(() => {
    return transactions
      .filter((item) => {
        const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || filterType === String(item.type || "").toLowerCase();
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filterType, searchTerm]);

  return (
    <div className={`rounded-2xl border overflow-hidden ${gradient ? "bg-slate-900/40 border-purple-700/40" : dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
      <div className={`p-4 border-b ${gradient ? "border-purple-700/40" : dark ? "border-slate-700" : "border-gray-100"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className={`font-semibold flex items-center gap-2 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
            <CreditCard size={18} className="text-blue-500" /> Recent Transactions
          </h3>

          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className={`pl-9 pr-3 py-1.5 text-sm border rounded-lg outline-none ${
                  gradient
                    ? "bg-slate-800/50 border-purple-700/50 text-white placeholder:text-purple-300"
                    : dark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-gray-200"
                }`}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-1.5 text-sm border rounded-lg outline-none ${
                gradient
                  ? "bg-slate-800/50 border-purple-700/50 text-white"
                  : dark
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-gray-200"
              }`}
            >
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`divide-y max-h-96 overflow-y-auto ${gradient ? "divide-purple-700/30" : dark ? "divide-slate-700" : "divide-gray-100"}`}>
        {sortedTransactions.map((item) => (
          <div key={item.id} className={`p-4 ${gradient ? "hover:bg-slate-800/50" : dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: item.type === "EXPENSE" ? "#fee2e2" : "#dcfce7", color: item.type === "EXPENSE" ? "#dc2626" : "#16a34a" }}
                >
                  {item.type === "EXPENSE" ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                </div>

                <div>
                  <p className={`font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs flex items-center gap-1 ${gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-400"}`}>
                      <Calendar size={11} />
                      {formatDate(item.date)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${getCategoryColor(item.category)}20`, color: getCategoryColor(item.category) }}>
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className={`font-semibold ${item.type === "EXPENSE" ? "text-red-600" : "text-green-600"}`}>
                {item.type === "EXPENSE" ? "-" : "+"}
                {formatCurrency(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { dark, gradient } = useTheme();
  const [trendRange, setTrendRange] = useState("monthly");

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = income ? ((income - expense) / income) * 100 : 0;
    return { income, expense, balance: income - expense, savingsRate };
  }, []);

  const pieData = [
    { name: "Income", value: totals.income },
    { name: "Expense", value: totals.expense },
  ];

  const categoryBarData = useMemo(() => {
    const grouped = transactions
      .filter((item) => item.type === "EXPENSE")
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, []);

  const cardClass = gradient
    ? "bg-slate-900/40 border-purple-700/40 shadow-[0_8px_24px_rgba(147,51,234,0.15)]"
    : dark
    ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
    : "bg-white border-gray-200 shadow-sm";
  const axisStroke = dark ? "#94a3b8" : "#64748b";
  const gridStroke = dark ? "#334155" : "#e2e8f0";

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Dashboard</h1>
          <p className={gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}>A clean overview of your money flow and spending behavior.</p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-xs ${
          gradient
            ? "bg-slate-900/40 border-purple-700/40 text-purple-200"
            : dark
            ? "bg-slate-900 border-slate-700 text-slate-300"
            : "bg-white border-gray-200 text-gray-600"
        }`}>
          <Sparkles size={14} className="text-blue-500" />
          Updated just now
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
          <p className="text-blue-100 text-sm">Total Balance</p>
          <h3 className="text-3xl font-bold mt-1">{formatCurrency(totals.balance)}</h3>
          <div className="mt-3 text-xs text-blue-100 flex items-center gap-1"><Wallet size={13} /> Net worth this month</div>
        </div>

        <div className={`rounded-2xl border p-5 ${cardClass}`}>
          <p className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>Income</p>
          <h3 className={`text-2xl font-bold mt-1 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{formatCurrency(totals.income)}</h3>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><ArrowUpRight size={13} /> Positive inflow</p>
        </div>

        <div className={`rounded-2xl border p-5 ${cardClass}`}>
          <p className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>Expenses</p>
          <h3 className={`text-2xl font-bold mt-1 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{formatCurrency(totals.expense)}</h3>
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><ArrowDownRight size={13} /> Outgoing payments</p>
        </div>

        <div className={`rounded-2xl border p-5 ${cardClass}`}>
          <p className={`text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>Savings Rate</p>
          <h3 className={`text-2xl font-bold mt-1 ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{totals.savingsRate.toFixed(1)}%</h3>
          <div className={`w-full h-2 rounded-full mt-3 ${gradient ? "bg-slate-700/50" : dark ? "bg-slate-700" : "bg-gray-200"}`}>
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, totals.savingsRate))}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Income vs Expense Trend</h3>
              <p className={`text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>Track your performance over time</p>
            </div>
            <TrendingUp size={18} className="text-blue-500" />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {["daily", "weekly", "monthly"].map((range) => (
              <button
                key={range}
                onClick={() => setTrendRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs border ${
                  trendRange === range
                    ? "bg-blue-600 text-white border-blue-600"
                    : gradient
                    ? "bg-slate-800/50 border-purple-700/50 text-purple-200"
                    : dark
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-white border-gray-200 text-gray-600"
                }`}
              >
                {range[0].toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <div className="w-full h-[290px]">
            <ResponsiveContainer>
              <LineChart data={trendDataByRange[trendRange]} margin={{ top: 8, right: 10, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="label" stroke={axisStroke} tickLine={false} axisLine={false} />
                <YAxis stroke={axisStroke} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [formatCurrency(value), name]} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.7} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.7} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Top Expense Categories</h3>
              <p className={`text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>Bar chart view of where money goes</p>
            </div>
          </div>

          <div className="w-full h-[290px]">
            <ResponsiveContainer>
              <BarChart data={categoryBarData} margin={{ top: 6, right: 10, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={axisStroke} tickLine={false} axisLine={false} />
                <YAxis stroke={axisStroke} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {categoryBarData.map((entry) => (
                    <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`rounded-2xl border p-5 xl:col-span-1 ${cardClass}`}>
          <h3 className={`font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Income vs Expense Split</h3>
          <p className={`text-xs mb-3 ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-500"}`}>Quick ratio for this period</p>
          <div className="h-[220px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-2">
          <TransactionList dark={dark} gradient={gradient} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
