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
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const getColorForCategory = (categoryName) => {
  if (!categoryName) return CATEGORY_COLORS[0];
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

// ---------- Helper Functions ----------
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `Rs. ${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatChartLabel = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const formatDateParam = (date) => {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  return !isNaN(d) ? d.toISOString().split("T")[0] : undefined;
};

const normalizeLineData = (rawData) => {
  if (!Array.isArray(rawData)) return [];
  return rawData
    .map((item, index) => {
      const dateValue =
        item.date ??
        item.Date ??
        item.transactionDate ??
        item.createdAt ??
        item.period ??
        `Day ${index + 1}`;
      const incomeValue = item.income ?? item.Income ?? item.incomeAmount ?? 0;
      const expenseValue =
        item.expense ?? item.Expense ?? item.expenseAmount ?? item.outcome ?? 0;
      let displayDate;
      if (dateValue instanceof Date) {
        displayDate = dateValue;
      } else if (
        typeof dateValue === "string" &&
        !isNaN(Date.parse(dateValue))
      ) {
        displayDate = new Date(dateValue);
      } else {
        displayDate = dateValue;
      }
      return {
        date: displayDate,
        dateLabel:
          typeof displayDate === "string"
            ? displayDate
            : displayDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
        Income: Number(incomeValue) || 0,
        Expense: Number(expenseValue) || 0,
      };
    })
    .filter((item) => item.Income > 0 || item.Expense > 0);
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
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

// Predefined color classes for Tailwind (avoids dynamic class issues)
const COLOR_CLASSES = {
  cyan: {
    text: "text-cyan-600",
    bg: "from-cyan-50 to-blue-50",
    border: "border-cyan-200",
    icon: "text-cyan-600",
  },
  rose: {
    text: "text-rose-600",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    icon: "text-rose-600",
  },
  emerald: {
    text: "text-emerald-600",
    bg: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
  },
  amber: {
    text: "text-amber-600",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    icon: "text-amber-600",
  },
};

// Custom Tooltips
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 text-xs font-semibold text-gray-800 dark:text-slate-200">
        <p className="font-bold mb-1">{data.name}</p>
        <p className="text-cyan-600 dark:text-cyan-400">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 space-y-1">
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

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 space-y-1 min-w-[140px]">
        <p className="text-xs font-bold text-gray-700 dark:text-slate-300 border-b pb-1 mb-1">
          {label}
        </p>
        {payload.map((entry, idx) => (
          <p
            key={idx}
            className="text-xs font-semibold flex justify-between gap-4"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span className="font-bold">{formatCurrency(entry.value)}</span>
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

  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  const [expensePieData, setExpensePieData] = useState([]);
  const [incomePieData, setIncomePieData] = useState([]); // 👈 NEW: Income categories
  const [lineGraphData, setLineGraphData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [normalizedLineData, setNormalizedLineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://localhost:7197/api/Reports";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const params = new URLSearchParams();
        if (dateRange.fromDate)
          params.append("fromDate", formatDateParam(dateRange.fromDate));
        if (dateRange.toDate)
          params.append("toDate", formatDateParam(dateRange.toDate));
        const queryString = params.toString();
        const separator = queryString ? "?" : "";

        // Fetch BOTH expense AND income category breakdowns
        const [expensePieRes, incomePieRes, lineRes, comparisonRes] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/pie-chart${separator}${queryString}${queryString ? "&" : "?"}transactionType=EXPENSE`,
              { signal: controller.signal },
            ),
            fetch(
              `${API_BASE_URL}/pie-chart${separator}${queryString}${queryString ? "&" : "?"}transactionType=INCOME`,
              { signal: controller.signal },
            ), // 👈 NEW
            fetch(`${API_BASE_URL}/line-graph${separator}${queryString}`, {
              signal: controller.signal,
            }),
            fetch(
              `${API_BASE_URL}/income-expense-comparison${separator}${queryString}`,
              { signal: controller.signal },
            ),
          ]);

        if (!expensePieRes.ok)
          throw new Error(`Expense pie API failed: ${expensePieRes.status}`);
        if (!incomePieRes.ok)
          throw new Error(`Income pie API failed: ${incomePieRes.status}`);
        if (!lineRes.ok)
          throw new Error(`Line graph API failed: ${lineRes.status}`);
        if (!comparisonRes.ok)
          throw new Error(`Comparison API failed: ${comparisonRes.status}`);

        // ✅ CORRECT - use lineRes (the response object), not lineJson
        const [expensePieJson, incomePieJson, lineJson, comparisonJson] =
          await Promise.all([
            expensePieRes.json(),
            incomePieRes.json(),
            lineRes.json(), // 👈 Fixed: lineRes, not lineJson
            comparisonRes.json(),
          ]);

        setExpensePieData(Array.isArray(expensePieJson) ? expensePieJson : []);
        setIncomePieData(Array.isArray(incomePieJson) ? incomePieJson : []); // 👈 NEW
        setNormalizedLineData(normalizeLineData(lineJson));
        setLineGraphData(Array.isArray(lineJson) ? lineJson : []);
        setComparisonData(Array.isArray(comparisonJson) ? comparisonJson : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load reports");
          console.error("Reports error:", err);
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const income = comparisonData.reduce(
      (sum, item) => sum + (Number(item.income) || Number(item.Income) || 0),
      0,
    );
    const expenses = comparisonData.reduce(
      (sum, item) =>
        sum +
        (Number(item.expense) ||
          Number(item.Expense) ||
          Number(item.outcome) ||
          0),
      0,
    );
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [comparisonData]);

  const pieData = useMemo(
    () =>
      [
        { name: "Income", value: totalIncome },
        { name: "Expenses", value: totalExpenses },
      ].filter((d) => d.value > 0),
    [totalIncome, totalExpenses],
  );

  const barData = useMemo(() => {
    if (totalIncome === 0 && totalExpenses === 0) return [];
    return [{ name: "Total", Income: totalIncome, Expenses: totalExpenses }];
  }, [totalIncome, totalExpenses]);

  const hasExpenses = expensePieData.length > 0;
  const hasIncome = incomePieData.length > 0; // 👈 NEW
  const hasLineData = normalizedLineData.length > 0;
  const hasComparisonData = comparisonData.length > 0;

  const handleClearDates = () => setDateRange({ fromDate: null, toDate: null });
  const getColorClasses = (colorKey) =>
    COLOR_CLASSES[colorKey] || COLOR_CLASSES.cyan;

  return (
    <div className={`space-y-6 pb-20 ${dark ? "text-white" : "text-gray-800"}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="mb-2">
          <h1
            className={`text-3xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}
          >
            Financial Reports
          </h1>
          <p className={`${dark ? "text-slate-400" : "text-gray-600"} text-sm`}>
            Visualize your income and expenses
          </p>
        </div>

        {/* Date Filter */}
        <div
          className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label
                className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}
              >
                From Date
              </label>
              <input
                type="date"
                value={
                  dateRange.fromDate ? formatDateParam(dateRange.fromDate) : ""
                }
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    fromDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
                className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
              />
            </div>
            <div>
              <label
                className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-gray-700"}`}
              >
                To Date
              </label>
              <input
                type="date"
                value={
                  dateRange.toDate ? formatDateParam(dateRange.toDate) : ""
                }
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    toDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
                className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${dark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
              />
            </div>
            <button
              onClick={handleClearDates}
              disabled={!dateRange.fromDate && !dateRange.toDate}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${dateRange.fromDate || dateRange.toDate ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          {(dateRange.fromDate || dateRange.toDate) && (
            <p
              className={`mt-2 text-xs ${dark ? "text-slate-400" : "text-gray-500"}`}
            >
              {dateRange.fromDate?.toLocaleDateString()} to{" "}
              {dateRange.toDate?.toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Error/Loading/Empty States */}
        {error && (
          <div
            className={`border rounded-xl p-3 text-sm ${dark ? "bg-red-900/30 border-red-700 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}
          >
            ⚠️ {error}
          </div>
        )}
        {loading && (
          <div
            className={`text-center py-8 rounded-xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mb-2"></div>
            <p
              className={`text-sm ${dark ? "text-slate-400" : "text-gray-500"}`}
            >
              Loading...
            </p>
          </div>
        )}
        {!loading &&
          !hasComparisonData &&
          !hasLineData &&
          !hasExpenses &&
          !hasIncome && (
            <div
              className={`text-center py-10 rounded-xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
            >
              <Wallet
                className={`w-10 h-10 mx-auto mb-2 ${dark ? "text-slate-500" : "text-gray-400"}`}
              />
              <p
                className={`text-sm ${dark ? "text-slate-400" : "text-gray-500"}`}
              >
                No data available
              </p>
            </div>
          )}

        {!loading &&
          (hasComparisonData || hasLineData || hasExpenses || hasIncome) && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    label: "Total Income",
                    value: totalIncome,
                    colorKey: "cyan",
                    icon: TrendingUp,
                  },
                  {
                    label: "Total Expenses",
                    value: totalExpenses,
                    colorKey: "rose",
                    icon: TrendingDown,
                  },
                  {
                    label: "Net Balance",
                    value: netBalance,
                    colorKey: netBalance >= 0 ? "emerald" : "amber",
                    icon: Wallet,
                  },
                ].map((card, idx) => {
                  const colors = getColorClasses(card.colorKey);
                  const isDarkBg = dark
                    ? "bg-slate-800 border-slate-700"
                    : `bg-gradient-to-br ${colors.bg} ${colors.border}`;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border transition-all hover:shadow-md ${isDarkBg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
                        >
                          {card.label}
                        </span>
                        <card.icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                      <p className={`text-xl font-bold ${colors.text}`}>
                        {formatCurrency(card.value)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pie Chart: Income vs Expenses */}
                <div
                  className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-cyan-100"}`}
                >
                  <h3
                    className={`text-sm font-bold mb-2 ${dark ? "text-cyan-400" : "text-cyan-700"}`}
                  >
                    Income vs Expenses
                  </h3>
                  {pieData.length === 0 ? (
                    <p
                      className={`text-center py-6 text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}
                    >
                      No data
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) =>
                            `${name}: ${formatChartLabel(value)}`
                          }
                          outerRadius={80}
                          innerRadius={40}
                          dataKey="value"
                          fontSize={10}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} stroke={dark ? "#1e293b" : "#fff"} strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Bar Chart: Comparison */}
                <div
                  className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-purple-100"}`}
                >
                  <h3
                    className={`text-sm font-bold mb-2 ${dark ? "text-purple-400" : "text-purple-700"}`}
                  >
                    Comparison
                  </h3>
                  {barData.length === 0 ? (
                    <p
                      className={`text-center py-6 text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}
                    >
                      No data
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={dark ? "#334155" : "#e5e7eb"}
                        />
                        <XAxis
                          dataKey="name"
                          stroke={dark ? "#94a3b8" : "#6b7280"}
                          fontSize={10}
                        />
                        <YAxis
                          tickFormatter={formatChartLabel}
                          stroke={dark ? "#94a3b8" : "#6b7280"}
                          fontSize={9}
                          width={35}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                        />
                        <Bar
                          dataKey="Income"
                          fill="#06b6d4"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="Expenses"
                          fill="#f43f5e"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Line Chart: Income vs Expense Over Time */}
              <div
                className={`rounded-xl p-3 border lg:col-span-2 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"}`}
              >
                <h3
                  className={`text-sm font-bold mb-2 ${dark ? "text-blue-400" : "text-blue-700"}`}
                >
                  Income vs Expense Over Time
                </h3>
                {!hasLineData ? (
                  <p
                    className={`text-center py-6 text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}
                  >
                    No trend data available
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={normalizedLineData}
                      margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={dark ? "#334155" : "#e5e7eb"}
                      />
                      <XAxis
                        dataKey="dateLabel"
                        stroke={dark ? "#94a3b8" : "#6b7280"}
                        fontSize={9}
                        tick={{ dy: 5 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickFormatter={formatChartLabel}
                        stroke={dark ? "#94a3b8" : "#6b7280"}
                        fontSize={9}
                        width={35}
                      />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Income"
                        name="Income"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Expense"
                        name="Expense"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {hasIncome && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Income Category List */}
                  <div
                    className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-emerald-100"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`text-sm font-bold ${dark ? "text-emerald-400" : "text-emerald-700"}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5" /> Income
                          Categories
                        </span>
                      </h3>
                      {incomePieData.length > 8 && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${dark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}
                        >
                          +{incomePieData.length - 8} more
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {incomePieData.slice(0, 8).map((item) => {
                        const color = getColorForCategory(item.categoryName);
                        return (
                          <li
                            key={item.categoryName || item.categoryId}
                            className={`flex justify-between items-center p-1.5 rounded text-xs transition-colors ${dark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                            title={`${item.categoryName}: ${formatCurrency(item.amount)}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white dark:border-slate-800"
                                style={{ backgroundColor: color }}
                                title={item.categoryName}
                              />
                              <span
                                className={`truncate ${dark ? "text-slate-300" : "text-gray-700"}`}
                              >
                                {item.categoryName}
                              </span>
                            </div>
                            <span className="font-bold whitespace-nowrap ml-2 text-emerald-600">
                              {formatChartLabel(item.amount)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Income Breakdown Pie Chart */}
                  <div
                    className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-emerald-100"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`text-sm font-bold ${dark ? "text-emerald-400" : "text-emerald-700"}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5" /> Income
                          Breakdown
                        </span>
                      </h3>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${dark ? "bg-slate-700 text-slate-400" : "bg-gray-100 text-gray-500"}`}
                        title="Distribution of income across different sources"
                      >
                        {" "}
                        ⓘ{" "}
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={incomePieData.slice(0, 6).map((item) => ({
                            name: item.categoryName,
                            value: item.amount,
                            color: getColorForCategory(item.categoryName),
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          dataKey="value"
                          paddingAngle={2}
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${formatChartLabel(value)}`}
                          fontSize={10}
                        >
                          {incomePieData.slice(0, 6).map((item, index) => (
                            <Cell
                              key={item.categoryName || index}
                              fill={getColorForCategory(item.categoryName)}
                              stroke={dark ? "#1e293b" : "#ffffff"}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          wrapperStyle={{
                            fontSize: "10px",
                            paddingTop: "20px"
                          }}
                          formatter={(value) => (
                            <span
                              className={`${dark ? "text-slate-300" : "text-gray-700"} truncate`}
                              title={value}
                            >
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Expense Categories & Breakdown (Original Sections) */}
              {hasExpenses && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Expense Category List */}
                  <div
                    className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-purple-100"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`text-sm font-bold ${dark ? "text-purple-400" : "text-purple-700"}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <ArrowDownRight className="w-3.5 h-3.5" /> Expense
                          Categories
                        </span>
                      </h3>
                      {expensePieData.length > 8 && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${dark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}
                        >
                          +{expensePieData.length - 8} more
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {expensePieData.slice(0, 8).map((item) => {
                        const color = getColorForCategory(item.categoryName);
                        return (
                          <li
                            key={item.categoryName || item.categoryId}
                            className={`flex justify-between items-center p-1.5 rounded text-xs transition-colors ${dark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                            title={`${item.categoryName}: ${formatCurrency(item.amount)}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white dark:border-slate-800"
                                style={{ backgroundColor: color }}
                                title={item.categoryName}
                              />
                              <span
                                className={`truncate ${dark ? "text-slate-300" : "text-gray-700"}`}
                              >
                                {item.categoryName}
                              </span>
                            </div>
                            <span className="font-bold whitespace-nowrap ml-2 text-rose-600">
                              {formatChartLabel(item.amount)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Expense Breakdown Pie Chart */}
                  <div
                    className={`rounded-xl p-3 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-rose-100"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`text-sm font-bold ${dark ? "text-rose-400" : "text-rose-700"}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <ArrowDownRight className="w-3.5 h-3.5" /> Expense
                          Breakdown
                        </span>
                      </h3>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${dark ? "bg-slate-700 text-slate-400" : "bg-gray-100 text-gray-500"}`}
                        title="Distribution of expenses across categories"
                      >
                        {" "}
                        ⓘ{" "}
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expensePieData.slice(0, 6).map((item) => ({
                            name: item.categoryName,
                            value: item.amount,
                            color: getColorForCategory(item.categoryName),
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          dataKey="value"
                          paddingAngle={2}
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${formatChartLabel(value)}`}
                          fontSize={10}
                        >
                          {expensePieData.slice(0, 6).map((item, index) => (
                            <Cell
                              key={item.categoryName || index}
                              fill={getColorForCategory(item.categoryName)}
                              stroke={dark ? "#1e293b" : "#ffffff"}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          wrapperStyle={{
                            fontSize: "10px",
                            paddingTop: "20px"
                          }}
                          formatter={(value) => (
                            <span
                              className={`${dark ? "text-slate-300" : "text-gray-700"} truncate`}
                              title={value}
                            >
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default Reports;
