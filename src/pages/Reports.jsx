import React from "react";
import { useTheme } from "../context/ThemeContext";
import sharedTransactions from "../dummyData/transactions.json";

const Reports = () => {
  const { dark } = useTheme();

  // Same mock transactions from Transactions.jsx
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
        ))}
      </div>
    );
  }
  return null;
};

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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income vs Expenses Pie Chart */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg p-4 border border-cyan-100">
                <h2 className="text-lg font-bold text-cyan-700 mb-3">Income vs Expenses Distribution</h2>
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
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg p-4 border border-purple-100">
                <h2 className="text-lg font-bold text-purple-700 mb-3">Financial Comparison</h2>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                    <YAxis tickFormatter={(v) => formatChartLabel(v)} stroke="#6b7280" fontSize={10} width={40} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Bar dataKey="Income" fill="#06b6d4" radius={[8, 8, 0, 0]} animationDuration={1000} />
                    <Bar dataKey="Expenses" fill="#f43f5e" radius={[8, 8, 0, 0]} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category List */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg p-4 border border-purple-100">
                <h2 className="text-lg font-bold text-purple-700 mb-3">Expense Categories</h2>
                {!hasExpenses ? (
                  <p className="text-gray-500 text-center py-8">No expenses recorded yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(expensesByCategory).map(([category, amount], idx) => (
                      <li
                        key={category}
                        className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-purple-300 transition-all hover:translate-x-1 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                          />
                          <span className="text-gray-700 font-medium truncate">{category}</span>
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
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg p-4 border border-orange-100">
                <h2 className="text-lg font-bold text-orange-700 mb-3">Category Breakdown</h2>
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