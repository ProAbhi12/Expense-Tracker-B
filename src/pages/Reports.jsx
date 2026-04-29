import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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

// Format date to ISO string, return undefined if date is null
const formatDateParam = (date) => {
  if (!date) return undefined;
  return date.toISOString().split("T")[0];
};

// Color palettes
const COLORS = ["#06b6d4", "#f43f5e"];
const CATEGORY_COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
];

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
          <p
            key={idx}
            className="text-xs font-semibold"
            style={{ color: entry.fill }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 space-y-1">
        {payload.map((entry, idx) => (
          <p
            key={idx}
            className="text-xs font-semibold"
            style={{ color: entry.color }}
          >
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

  // State management - dates are optional (null by default)
  const [dateRange, setDateRange] = useState({
    fromDate: null,
    toDate: null,
  });

  // Three independent data states for each API endpoint
  const [pieChartData, setPieChartData] = useState([]);
  const [lineGraphData, setLineGraphData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE_URL = "https://localhost:7197/api/Reports";

  // Fetch data from three separate API endpoints
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Add timeout to prevent infinite hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const params = new URLSearchParams();
        if (dateRange.fromDate) {
          params.append("fromDate", formatDateParam(dateRange.fromDate));
        }
        if (dateRange.toDate) {
          params.append("toDate", formatDateParam(dateRange.toDate));
        }

        const queryString = params.toString();
        const separator = queryString ? "?" : "";

        // Three independent API calls with abort signal
        const [pieRes, lineRes, comparisonRes] = await Promise.all([
          fetch(
            `${API_BASE_URL}/pie-chart${separator}${queryString}${queryString ? "&" : "?"}transactionType=EXPENSE`,
            { signal: controller.signal },
          ),
          // fetch(`${API_BASE_URL}/pie-chart${separator}${queryString}`, {
          //   signal: controller.signal,
          // }),
          fetch(`${API_BASE_URL}/line-graph${separator}${queryString}`, {
            signal: controller.signal,
          }),
          fetch(
            `${API_BASE_URL}/income-expense-comparison${separator}${queryString}`,
            { signal: controller.signal },
          ),
        ]);

        if (!pieRes.ok) throw new Error(`Pie chart failed: ${pieRes.status}`);
        if (!lineRes.ok)
          throw new Error(`Line graph failed: ${lineRes.status}`);
        if (!comparisonRes.ok)
          throw new Error(`Comparison failed: ${comparisonRes.status}`);

        const [pieJson, lineJson, comparisonJson] = await Promise.all([
          pieRes.json(),
          lineRes.json(),
          comparisonRes.json(),
        ]);

        setPieChartData(pieJson);
        setLineGraphData(lineJson);
        setComparisonData(comparisonJson);
      } catch (err) {
        if (err.name === "AbortError") {
          setError(
            "API request timed out (10s). Check if backend is responding.",
          );
        } else {
          setError(err.message || "Failed to load reports data");
        }
        console.error("Error loading reports:", err);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Calculate totals from comparison data
  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const income = comparisonData.reduce(
      (sum, item) => sum + (item.income || item.Income || 0),
      0,
    );
    const expenses = comparisonData.reduce(
      (sum, item) => sum + (item.expense || item.Expense || 0),
      0,
    );
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [comparisonData]);

  // Prepare pie chart data
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  // Prepare bar chart data
  const barData = [
    { name: "Amount", Income: totalIncome, Expenses: totalExpenses },
  ];

  const hasExpenses = pieChartData.length > 0;
  const hasLineData = lineGraphData.length > 0;
  const hasData = comparisonData.length > 0;

  // Handle clear dates
  const handleClearDates = () => {
    setDateRange({ fromDate: null, toDate: null });
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${dark ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${dark ? "text-slate-100" : "text-gray-800"}`}
          >
            Financial Reports
          </h1>
          <p
            className={`${dark ? "text-slate-400" : "text-gray-600"} text-sm sm:text-base`}
          >
            Visualize your income and expenses with real-time insights
          </p>
        </div>

        {/* Date Range Filter */}
        <div
          className={`rounded-2xl shadow-lg p-4 border transition-colors ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${dark ? "text-slate-300" : "text-gray-700"}`}
              >
                From Date (Optional)
              </label>
              <input
                type="date"
                value={
                  dateRange.fromDate
                    ? dateRange.fromDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    fromDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${dark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${dark ? "text-slate-300" : "text-gray-700"}`}
              >
                To Date (Optional)
              </label>
              <input
                type="date"
                value={
                  dateRange.toDate
                    ? dateRange.toDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    toDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${dark ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-gray-800"}`}
              />
            </div>
            <button
              onClick={handleClearDates}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                dateRange.fromDate || dateRange.toDate
                  ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!dateRange.fromDate && !dateRange.toDate}
            >
              <X className="w-4 h-4" />
              Clear Dates
            </button>
          </div>
          {(dateRange.fromDate || dateRange.toDate) && (
            <div
              className={`mt-3 text-sm ${dark ? "text-slate-400" : "text-gray-600"}`}
            >
              Showing data from{" "}
              {dateRange.fromDate?.toLocaleDateString() || "the beginning"} to{" "}
              {dateRange.toDate?.toLocaleDateString() || "today"}
            </div>
          )}
          {!dateRange.fromDate && !dateRange.toDate && (
            <div
              className={`mt-3 text-sm ${dark ? "text-slate-400" : "text-gray-600"}`}
            >
              Showing all available data
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`border rounded-2xl p-4 ${dark ? "bg-red-900/30 border-red-700 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}
          >
            <p className="font-semibold">Error: {error}</p>
            <p className="text-sm">
              Make sure the backend API is running on http://localhost:5000
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            className={`text-center py-12 rounded-2xl shadow-md border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className={dark ? "text-slate-400" : "text-gray-600"}>
              Loading reports...
            </p>
          </div>
        )}

        {!hasData && !loading ? (
          <div
            className={`text-center py-12 rounded-2xl shadow-md border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No transactions found for the selected date range.
            </p>
          </div>
        ) : (
          !loading && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Income Card */}
                <div
                  className={`group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`${dark ? "text-slate-300" : "text-gray-700"} font-semibold text-sm`}
                    >
                      Total Income
                    </h3>
                    <TrendingUp className="w-5 h-5 text-cyan-600" />
                  </div>
                  <p className="text-3xl font-bold text-cyan-600 mb-2">
                    {formatCurrency(totalIncome)}
                  </p>
                  <p
                    className={`text-xs ${dark ? "text-cyan-400/60" : "text-cyan-700"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    ✓ All income sources combined
                  </p>
                </div>

                {/* Expense Card */}
                <div
                  className={`group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`${dark ? "text-slate-300" : "text-gray-700"} font-semibold text-sm`}
                    >
                      Total Expenses
                    </h3>
                    <TrendingDown className="w-5 h-5 text-rose-600" />
                  </div>
                  <p className="text-3xl font-bold text-rose-600 mb-2">
                    {formatCurrency(totalExpenses)}
                  </p>
                  <p
                    className={`text-xs ${dark ? "text-rose-400/60" : "text-rose-700"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    ✓ All expense transactions
                  </p>
                </div>

                {/* Balance Card */}
                <div
                  className={`group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${
                    dark
                      ? "bg-slate-800 border-slate-700 shadow-none"
                      : netBalance >= 0
                        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                        : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`${dark ? "text-slate-300" : "text-gray-700"} font-semibold text-sm`}
                    >
                      Net Balance
                    </h3>
                    <Wallet
                      className={`w-5 h-5 ${netBalance >= 0 ? "text-emerald-600" : "text-amber-600"}`}
                    />
                  </div>
                  <p
                    className={`text-3xl font-bold mb-2 ${netBalance >= 0 ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {formatCurrency(netBalance)}
                  </p>
                  <p
                    className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${netBalance >= 0 ? "text-emerald-700" : "text-amber-700"}`}
                  >
                    {netBalance >= 0
                      ? "✓ You're in surplus"
                      : "⚠ You're in deficit"}
                  </p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Pie Chart */}
                <div
                  className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-cyan-100"}`}
                >
                  <h2
                    className={`text-lg font-bold mb-3 ${dark ? "text-cyan-400" : "text-cyan-700"}`}
                  >
                    Income vs Expenses Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={340}>
                    <PieChart
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          `${name}\n${formatChartLabel(value)}`
                        }
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
                <div
                  className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-purple-100"}`}
                >
                  <h2
                    className={`text-lg font-bold mb-3 ${dark ? "text-purple-400" : "text-purple-700"}`}
                  >
                    Financial Comparison
                  </h2>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart
                      data={barData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={dark ? "#334155" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={dark ? "#94a3b8" : "#6b7280"}
                        fontSize={11}
                      />
                      <YAxis
                        tickFormatter={(v) => formatChartLabel(v)}
                        stroke={dark ? "#94a3b8" : "#6b7280"}
                        fontSize={10}
                        width={40}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                      />
                      <Bar
                        dataKey="Income"
                        fill="#06b6d4"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="Expenses"
                        fill="#f43f5e"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Trend Line Chart — add in the Charts Section grid, make it full width */}
              <div
                className={`rounded-2xl shadow-lg p-4 border lg:col-span-2 ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-blue-100"}`}
              >
                <h2
                  className={`text-lg font-bold mb-3 ${dark ? "text-blue-400" : "text-blue-700"}`}
                >
                  Income vs Expense Over Time
                </h2>
                {!hasLineData ? (
                  <p className="text-gray-500 text-center py-8">
                    No trend data available.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={lineGraphData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={dark ? "#334155" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="Date"
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        stroke={dark ? "#94a3b8" : "#6b7280"}
                        fontSize={10}
                      />
                      <YAxis
                        tickFormatter={formatChartLabel}
                        stroke={dark ? "#94a3b8" : "#6b7280"}
                        fontSize={10}
                        width={40}
                      />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Income"
                        name="Income"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={1000}
                      />
                      <Line
                        type="monotone"
                        dataKey="Expense"
                        name="Expense"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Expense Breakdown Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {/* Category List */}
                <div
                  className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-purple-100"}`}
                >
                  <h2
                    className={`text-lg font-bold mb-3 ${dark ? "text-purple-400" : "text-purple-700"}`}
                  >
                    Expense Categories
                  </h2>
                  {!hasExpenses ? (
                    <p className="text-gray-500 text-center py-8">
                      No expenses recorded yet.
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {pieChartData.map((item, idx) => (
                        <li
                          key={item.categoryName}
                          className={`flex justify-between items-center p-2 rounded-lg border transition-all hover:translate-x-1 text-sm ${dark ? "bg-slate-700/50 border-slate-600 hover:border-purple-500" : "bg-gray-50 border-gray-200 hover:border-purple-300"}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  item.color ||
                                  CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                              }}
                            />
                            <span
                              className={`${dark ? "text-slate-300" : "text-gray-700"} font-medium truncate`}
                            >
                              {item.categoryName}
                            </span>
                          </div>
                          <span
                            className="font-bold whitespace-nowrap"
                            style={{
                              color:
                                item.color ||
                                CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                            }}
                          >
                            {formatChartLabel(item.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Category Pie Chart */}
                <div
                  className={`rounded-2xl shadow-lg p-4 border ${dark ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white/80 backdrop-blur-sm border-orange-100"}`}
                >
                  <h2
                    className={`text-lg font-bold mb-3 ${dark ? "text-orange-400" : "text-orange-700"}`}
                  >
                    Category Breakdown
                  </h2>
                  {!hasExpenses ? (
                    <p className="text-gray-500 text-center py-8">
                      No expense data to display.
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <Pie
                          data={pieChartData.map((item) => ({
                            name: item.categoryName,
                            value: item.amount,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) =>
                            `${name}\n${formatChartLabel(value)}`
                          }
                          outerRadius={90}
                          dataKey="value"
                          animationDuration={1000}
                          fontSize={9}
                        >
                          {pieChartData.map((_, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={
                                pieChartData[idx]?.color ||
                                CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Reports;
