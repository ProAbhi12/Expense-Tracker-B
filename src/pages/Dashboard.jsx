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

  // 1. DATA CONTAINERS
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

  // 2. FETCH ALL DATA
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
          .filter((i) => i.amount > 0)
          .map((i) => ({
            name: i.categoryName,
            value: i.amount,
            color: i.color,
          })),
      );

      const lineRes = await fetch(`${baseUrl}/Reports/line-graph`);
      const lineJson = await lineRes.json();
      setLineData(
        lineJson.map((i) => ({
          date: new Date(i.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          amount: i.amount,
        })),
      );

      const historyRes = await fetch(`${baseUrl}/Transactions/alltransactions`);
      const historyJson = await historyRes.json();
      // Map correctly to use 'type' string comparison
      setRecentTransactions(
        Array.isArray(historyJson) ? historyJson.slice(0, 5) : [],
      );
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRs = (num) => `Rs. ${num.toLocaleString()}`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1
          className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}
        >
          Dashboard Overview{" "}
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-600/20">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">
            Total Balance
          </p>
          <h3 className="text-3xl font-black">
            {formatRs(summary.totalBalance)}
          </h3>
          <p className="mt-4 text-[10px] bg-white/20 inline-block px-2 py-1 rounded">
            {summary.transactionCount} Entries Found
          </p>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">
            Monthly Income
          </p>
          <h3 className="text-2xl font-black text-green-500">
            {formatRs(summary.totalIncome)}
          </h3>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">
            Monthly Expenses
          </p>
          <h3 className="text-2xl font-black text-red-500">
            {formatRs(summary.totalExpense)}
          </h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase opacity-70">
            <PieIcon size={16} className="text-blue-500" /> Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase opacity-70">
            <Activity size={16} className="text-green-500" /> Spending Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={dark ? "#334155" : "#f3f4f6"}
                />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div
        className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-sm uppercase opacity-70">
            <History size={16} className="text-orange-500" /> Recent Activity
          </h3>
          <Link
            to="/transactions"
            className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
          >
            View All History <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-slate-800">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${t.type === "INCOME" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {t.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-[10px] text-gray-400">
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
                <p className="text-[9px] text-gray-400 uppercase font-medium">
                  {t.method}
                </p>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="p-10 text-center text-gray-400 text-xs italic font-medium">
              No transactions found in SQL database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
