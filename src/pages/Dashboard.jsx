import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
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
        lineJson.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          amount: item.amount,
        })),
      );

      const historyRes = await fetch(`${baseUrl}/Transactions/alltransactions`);
      const historyJson = await historyRes.json();
      setRecentTransactions(
        Array.isArray(historyJson) ? historyJson.slice(0, 5) : [],
      );
    } catch (error) {
      console.error("Database Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRs = (num) => `Rs. ${num.toLocaleString()}`;

  return (
    <div className="space-y-6 pb-20 text-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${dark ? "text-white" : "text-black"}`}
          >
            Dashboard Overview
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-600/30">
          <div className="flex justify-between items-center mb-4">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">
              Total Balance
            </p>
            <Wallet size={20} className="text-white opacity-80" />
          </div>
          <h3 className="text-3xl font-black">
            {formatRs(summary.totalBalance)}
          </h3>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
              {summary.transactionCount} Total Entries
            </span>
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
            Monthly Income
          </p>
          <h3 className="text-2xl font-black text-green-500">
            {formatRs(summary.totalIncome)}
          </h3>
        </div>

        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
            Monthly Expenses
          </p>
          <h3 className="text-2xl font-black text-red-500">
            {formatRs(summary.totalExpense)}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider opacity-70">
            <PieIcon size={16} className="text-blue-500" /> Expense Breakdown
          </h3>
          <div className="h-72">
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
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider opacity-70">
            <Activity size={16} className="text-green-500" /> Spending Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={dark ? "#334155" : "#f3f4f6"}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => formatRs(value)} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center text-black dark:text-white">
          <h3 className="font-bold flex items-center gap-2 text-sm uppercase opacity-70">
            <History size={16} className="text-orange-500" /> Recent Activity
          </h3>
          <Link
            to="/transactions"
            className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-black dark:text-white"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${t.type === "INCOME" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {t.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-[10px] opacity-60">
                    {t.categoryName} • {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-black ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}
                >
                  {t.type === "INCOME" ? "+" : "-"} Rs. {t.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
