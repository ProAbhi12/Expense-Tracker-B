import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// ---------- Static Mock Data ----------
const mockTransactions = [
  {
    id: 1,
    name: "Salary Deposit",
    type: "INCOME",
    category: { name: "Salary" },
    source: "Company XYZ",
    reason: "MOBILE_BANKING",
    date: "2026-04-15",
    amount: 45000,
  },
  {
    id: 2,
    name: "Monthly Grocery",
    type: "EXPENSE",
    category: { name: "Food" },
    source: "Big Mart",
    reason: "CASH",
    date: "2026-04-18",
    amount: 8500,
  },
  {
    id: 3,
    name: "Internet Bill",
    type: "EXPENSE",
    category: { name: "Utilities" },
    source: "Vianet",
    reason: "ESEWA",
    date: "2026-04-17",
    amount: 1200,
  },
  {
    id: 4,
    name: "Freelance Payment",
    type: "INCOME",
    category: { name: "Freelance" },
    source: "Upwork Client",
    reason: "BANK_TRANSFER",
    date: "2026-04-19",
    amount: 15000,
  },
];

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
      const cat = tx.category.name;
      acc[cat] = (acc[cat] || 0) + tx.amount;
      return acc;
    }, {});
  return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses, expensesByCategory: byCategory };
};

// Color palettes
const COLORS = ["#06b6d4", "#f43f5e"];
const CATEGORY_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

// Custom Tooltips
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-xs font-semibold text-gray-800">
        {payload[0].name}: {formatCurrency(payload[0].value)}
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 space-y-1">
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs font-semibold" style={{ color: entry.fill }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ---------- Main Component ----------
const Reports = () => {
  const { dark } = useTheme();
  
  const { totalIncome, totalExpenses, netBalance, expensesByCategory } = useMemo(
    () => getFinancialData(mockTransactions),
    []
  );

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];
  const barData = [{ name: "Amount", Income: totalIncome, Expenses: totalExpenses }];
  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  const hasExpenses = categoryData.length > 0;
  const hasData = mockTransactions.length > 0;

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${dark ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"}`}>     
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${dark ? "text-slate-100" : "text-gray-800"}`}>
            Financial Reports
          </h1>
          <p className={`${dark ? "text-slate-400" : "text-gray-600"} text-sm sm:text-base`}>
            Visualize your income and expenses with real-time insights
          </p>
        </div>

        {!hasData ? (
          <div className={`text-center py-12 rounded-2xl shadow-md border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No transactions yet. Add some to see reports.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Income Card */}
              <div className={`group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${dark ? "text-slate-300" : "text-gray-700"} font-semibold text-sm`}>Total Income</h3>
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                </div>
                <p className="text-3xl font-bold text-cyan-600 mb-2">{formatCurrency(totalIncome)}</p>
                <p className={`text-xs ${dark ? "text-cyan-400/60" : "text-cyan-700"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  ✓ All income sources combined
                </p>
              </div>

              {/* Expense Card */}
              <div className={`group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${dark ? "text-slate-300" : "text-gray-700"} font-semibold text-sm`}>Total Expenses</h3>
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{formatCurrency(totalExpenses)}</p>       
                <p className={`text-xs ${dark ? "text-rose-400/60" : "text-rose-700"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  ✓ All expense transactions
                </p>
              </div>

              {/* Balance Card */}
              <div
                className={`group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${
                  dark ? "bg-slate-800 border-slate-700 shadow-none" : 
                  netBalance >= 0
                    ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${dark ? "text-slate-300" : "text-gray-700"} font-semibold text-sm`}>Net Balance</h3>
                  <Wallet className={`w-5 h-5 ${netBalance >= 0 ? "text-emerald-600" : "text-amber-600"}`} />  
                </div>
                <p className={`text-3xl font-bold mb-2 ${netBalance >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {formatCurrency(netBalance)}
                </p>
                <p className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${netBalance >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                  {netBalance >= 0 ? "✓ You're in surplus" : "⚠ You're in deficit"}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income vs Expenses Pie Chart */}
              <div className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-cyan-100"}`}>  
                <h2 className={`text-lg font-bold mb-3 ${dark ? "text-cyan-400" : "text-cyan-700"}`}>Income vs Expenses Distribution</h2>      
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
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart Comparison */}
              <div className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-purple-100"}`}>
                <h2 className={`text-lg font-bold mb-3 ${dark ? "text-purple-400" : "text-purple-700"}`}>Financial Comparison</h2>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#334155" : "#e5e7eb"} />
                    <XAxis dataKey="name" stroke={dark ? "#94a3b8" : "#6b7280"} fontSize={11} />
                    <YAxis tickFormatter={(v) => formatChartLabel(v)} stroke={dark ? "#94a3b8" : "#6b7280"} fontSize={10} width={40} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Bar dataKey="Income" fill="#06b6d4" radius={[8, 8, 0, 0]} animationDuration={1000} />     
                    <Bar dataKey="Expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} animationDuration={1000} />   
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
              {/* Category List */}
              <div className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-purple-100"}`}>
                <h2 className={`text-lg font-bold mb-3 ${dark ? "text-purple-400" : "text-purple-700"}`}>Expense Categories</h2>
                {!hasExpenses ? (
                  <p className="text-gray-500 text-center py-8">No expenses recorded yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(expensesByCategory).map(([category, amount], idx) => (
                      <li
                        key={category}
                        className={`flex justify-between items-center p-2 rounded-lg border transition-all hover:translate-x-1 text-sm ${dark ? "bg-slate-700/50 border-slate-600 hover:border-purple-500" : "bg-gray-50 border-gray-200 hover:border-purple-300"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                          />
                          <span className={`${dark ? "text-slate-300" : "text-gray-700"} font-medium truncate`}>{category}</span>
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
              <div className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-orange-100"}`}>
                <h2 className={`text-lg font-bold mb-3 ${dark ? "text-orange-400" : "text-orange-700"}`}>Category Breakdown</h2>
                {!hasExpenses ? (
                  <p className="text-gray-500 text-center py-8">No expense data to display.</p>
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
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
