import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  Wallet,
  PieChart as PieIcon,
  Activity,
  ArrowRight,
  History,
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
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { dark } = useTheme();

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const baseUrl = "https://localhost:7197/api";

      const summaryRes = await fetch(`${baseUrl}/Dashboard/summary`);
      setSummary(await summaryRes.json());

      const pieRes = await fetch(`${baseUrl}/Reports/pie-chart`);
      const pieJson = await pieRes.json();
      setPieData(
        pieJson
          .filter((item) => item.amount > 0)
          .map((item) => ({
            name: item.categoryName,
            value: item.amount,
            color: item.color,
          })),
      );

      const lineRes = await fetch(`${baseUrl}/Reports/line-graph`);
      const lineJson = await lineRes.json();
      setLineData(
        Array.isArray(lineJson)
          ? lineJson.map((item) => ({
              date: item.date
                ? new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A",
              income: item.income ?? 0,
              expense: item.expense ?? 0,
            }))
          : [],
      );

      const historyRes = await fetch(`${baseUrl}/Transactions/alltransactions`);
      const historyJson = await historyRes.json();

      setRecentTransactions(
        Array.isArray(historyJson)
          ? [...historyJson]
              .sort((a, b) => {
                const dateA = new Date(
                  a.date || a.transactionDate || a.createdAt || 0,
                );
                const dateB = new Date(
                  b.date || b.transactionDate || b.createdAt || 0,
                );
                return dateB - dateA;
              })
              .slice(0, 5)
          : [],
      );
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRs = (num) => `Rs. ${Number(num || 0).toLocaleString()}`;

  const card = dark
    ? "bg-slate-900 border-slate-700 text-white"
    : "bg-white border-gray-100 shadow-sm text-gray-800";

  const divider = dark ? "divide-slate-700" : "divide-gray-100";
  const hoverRow = dark ? "hover:bg-slate-800" : "hover:bg-gray-50";
  const borderBottom = dark ? "border-slate-700" : "border-gray-100";
  const subText = dark ? "text-slate-400" : "text-gray-500";
  const axisColor = dark ? "#94a3b8" : "#9ca3af";
  const gridColor = dark ? "#334155" : "#f3f4f6";

  return (
    // ✅ CHANGE 1: Reduced top spacing - changed space-y-5 to space-y-3, added pt-1
    <div
      className={`space-y-3 pb-20 pt-1 ${dark ? "text-white" : "text-gray-800"}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* ✅ Reduced gap and added tighter margin */}
        <h1
          className={`text-2xl sm:text-3xl font-bold mt-0 ${dark ? "text-white" : "text-gray-900"}`}
        >
          Dashboard Overview
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-xl shadow-blue-600/30">
          <div className="flex justify-between items-center mb-3">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">
              Total Balance
            </p>
            <Wallet size={18} className="text-white opacity-80" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            {formatRs(summary.totalBalance)}
          </h3>
          <div className="mt-3">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
              {summary.transactionCount} Total Entries
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${card}`}>
          <p
            className={`text-xs font-bold uppercase tracking-widest mb-1 ${subText}`}
          >
            Monthly Income
          </p>
          <h3 className="text-2xl font-black text-green-500">
            {formatRs(summary.totalIncome)}
          </h3>
        </div>

        <div className={`p-5 rounded-2xl border ${card}`}>
          <p
            className={`text-xs font-bold uppercase tracking-widest mb-1 ${subText}`}
          >
            Monthly Expenses
          </p>
          <h3 className="text-2xl font-black text-red-500">
            {formatRs(summary.totalExpense)}
          </h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className={`p-5 rounded-2xl border ${card}`}>
          {/* ✅ CHANGE 2: Made title text black (dark mode aware) */}
          <h3
            className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider ${dark ? "text-white" : "text-black"}`}
          >
            <PieIcon size={16} className="text-blue-500" /> Expense Breakdown
          </h3>
          <div className="h-72">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    fontSize={10}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatRs(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                className={`h-full flex items-center justify-center text-sm ${subText}`}
              >
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Line Chart */}
        <div className={`p-5 rounded-2xl border ${card}`}>
          {/* ✅ CHANGE 2: Made title text black (dark mode aware) */}
          <h3
            className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider ${dark ? "text-white" : "text-black"}`}
          >
            <Activity size={16} className="text-green-500" /> Spending Trend
          </h3>
          <div className="h-72">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={gridColor}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={axisColor}
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={axisColor}
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatRs(value),
                      name === "Income" ? "Income" : "Expense",
                    ]}
                    contentStyle={{
                      backgroundColor: dark ? "#1e293b" : "#fff",
                      border: dark ? "1px solid #334155" : "1px solid #e5e7eb",
                      color: dark ? "#fff" : "#111",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#22c55e" }}
                    activeDot={{ r: 5 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#ef4444" }}
                    activeDot={{ r: 5 }}
                    name="Expense"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                className={`h-full flex items-center justify-center text-sm ${subText}`}
              >
                No trend data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`rounded-2xl border overflow-hidden ${card}`}>
        <div
          className={`p-4 border-b ${borderBottom} flex justify-between items-center`}
        >
          <h3
            className={`font-bold flex items-center gap-2 text-sm  tracking-wider ${dark ? "text-white" : "text-black"}`}
          >
            <History size={16} className="text-orange-500" /> Recent Activity
          </h3>
          <Link
            to="/transactions"
            className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className={`divide-y ${divider}`}>
          {loading ? (
            <div className={`p-6 text-center text-sm ${subText}`}>
              Loading...
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className={`p-6 text-center text-sm ${subText}`}>
              No transactions yet
            </div>
          ) : (
            recentTransactions.map((t) => {
              const txDate = t.date || t.transactionDate || t.createdAt;
              const isIncome = t.type === "INCOME";

              return (
                <div
                  key={t.id}
                  className={`p-4 flex items-center justify-between transition-colors ${hoverRow}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isIncome
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t.name}</p>
                      <p className={`text-[10px] ${subText}`}>
                        {t.categoryName ?? "Uncategorized"} •{" "}
                        {txDate
                          ? new Date(txDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "No date"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-black ${isIncome ? "text-green-500" : "text-red-500"}`}
                    >
                      {isIncome ? "+" : "−"} Rs.{" "}
                      {Number(t.amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
