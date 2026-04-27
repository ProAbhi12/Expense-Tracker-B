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
  LayoutDashboard,
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

  // 2. FETCH ALL DATA FROM API
  const fetchData = async () => {
    try {
      setLoading(true);
      const baseUrl = "https://localhost:7197/api";

      // Get Summary
      const summaryRes = await fetch(`${baseUrl}/Dashboard/summary`);
      setSummary(await summaryRes.json());

      // Get Pie Chart (Expenses by Category)
      const pieRes = await fetch(`${baseUrl}/Reports/pie-chart`);
      const pieJson = await pieRes.json();
      // Filter out categories with 0 spending to keep chart clean
      setPieData(
        pieJson
          .filter((item) => item.amount > 0)
          .map((item) => ({
            name: item.categoryName,
            value: item.amount,
            color: item.color,
          })),
      );

      // Get Line Graph (Daily spending trend)
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

      // Get Recent Activity (Latest 5)
      const historyRes = await fetch(`${baseUrl}/Dashboard/summary`); // Temporary: replace with real history API
      // For now we use the Summary count or hardcoded list if history endpoint isn't ready
      // I'll show a sample list if empty
      setRecentTransactions([]);
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}
          >
            Financial Overview
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${loading ? "bg-orange-400 animate-pulse" : "bg-green-500"}`}
            ></div>
            <p className="text-xs text-gray-500 font-medium">
              {loading ? "Syncing SQL Server..." : "Live Data Connected"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-600/30">
          <div className="flex justify-between items-center mb-4">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">
              Net Balance
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
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            Monthly Income
          </p>
          <h3 className="text-2xl font-black text-green-500">
            {formatRs(summary.totalIncome)}
          </h3>
          <div className="mt-4 flex items-center text-green-600 text-[10px] font-bold">
            <ArrowUpRight size={12} className="mr-1" /> ACTIVE REVENUE
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            Monthly Expenses
          </p>
          <h3 className="text-2xl font-black text-red-500">
            {formatRs(summary.totalExpense)}
          </h3>
          <div className="mt-4 flex items-center text-red-600 text-[10px] font-bold">
            <ArrowDownRight size={12} className="mr-1" /> ACTIVE SPENDING
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart with Real Labels */}
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider opacity-70">
            <PieIcon size={16} className="text-blue-500" /> Expense Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
                  fontSize={10}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatRs(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "bold",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider opacity-70">
            <Activity size={16} className="text-green-500" /> Spending Trend
          </h3>
          <div className="h-64">
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
                <Tooltip
                  formatter={(value) => formatRs(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "bold",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer link to full history */}
      <div className="flex justify-center">
        <Link
          to="/transactions"
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all"
        >
          Go to Detailed Transaction Logs <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
