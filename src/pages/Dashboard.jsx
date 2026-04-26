import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const { dark } = useTheme();
  
  // 1. CREATE CONTAINERS (State) to hold our real data
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  // 2. THE FETCH FUNCTION (The Waiter)
  const fetchDashboardData = async (fromDate = "", toDate = "") => {
    try {
      setLoading(true);
      
      // We build the URL with the dates (Empty dates = Get All as mentor requested)
      const url = `https://localhost:7164/api/Dashboard/summary?FromDate=${fromDate}&ToDate=${toDate}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Save the real data into our container
      setSummary(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. THE TRIGGER (Run once when page opens)
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Formatting Helper ---
  const formatRs = (num) => `Rs. ${num.toLocaleString()}`;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Dashboard</h1>     
          <p className={dark ? "text-slate-400" : "text-gray-500"}>
            {loading ? "Syncing with database..." : "Connected to Live Data"}
          </p>
        </div>
      </div>

      {/* KPI Cards - Now using REAL DATA from 'summary' */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg shadow-blue-600/20">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <Wallet size={20} />
          </div>
          <h3 className="text-3xl font-bold">{formatRs(summary.totalBalance)}</h3>
          <div className="mt-4 flex items-center text-blue-100 text-xs font-medium">
            <TrendingUp size={14} className="mr-1" />
            <span>Based on {summary.transactionCount} transactions</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-200"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Total Income</p>
            <ArrowUpRight size={20} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold">{formatRs(summary.totalIncome)}</h3>
          <p className="text-green-600 text-xs font-bold mt-2">Live from Database</p>
        </div>

        <div className={`p-6 rounded-xl border ${dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-gray-200"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold">{formatRs(summary.totalExpense)}</h3>
          <p className="text-red-600 text-xs font-bold mt-2">This Period</p>
        </div>
      </div>

      {/* Placeholder for Charts (Integration task for Member E) */}
      <div className="bg-gray-50 dark:bg-slate-800 p-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-center">
          <CreditCard className="mx-auto text-gray-400 mb-4" size={40} />
          <h4 className={`font-bold ${dark ? "text-white" : "text-gray-700"}`}>Charts integration in progress</h4>
          <p className="text-sm text-gray-500">Member E is connecting the Reports API here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
