import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  TrendingUp,
  Calendar,
  Search,
} from "lucide-react";

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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
  return colors[category] || "#6b7280";
};

// ============================================
// TRANSACTION DATA
// ============================================
const transactions = [
  {
    id: 1,
    description: "Grocery Store - Supermart",
    category: "Food",
    amount: 284.5,
    type: "expense",
    date: "2026-04-18T00:00:00Z",
  },
  {
    id: 2,
    description: "Salary Deposit",
    category: "Income",
    amount: 4250.0,
    type: "income",
    date: "2026-04-15T00:00:00Z",
  },
  {
    id: 3,
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    type: "expense",
    date: "2026-04-14T00:00:00Z",
  },
  {
    id: 4,
    description: "Starbucks Coffee",
    category: "Coffee",
    amount: 8.45,
    type: "expense",
    date: "2026-04-17T00:00:00Z",
  },
  {
    id: 5,
    description: "Electric Bill",
    category: "Utilities",
    amount: 124.2,
    type: "expense",
    date: "2026-04-12T00:00:00Z",
  },
  {
    id: 6,
    description: "Freelance Project",
    category: "Income",
    amount: 850.0,
    type: "income",
    date: "2026-04-10T00:00:00Z",
  },
  {
    id: 7,
    description: "New Jeans",
    category: "Shopping",
    amount: 89.99,
    type: "expense",
    date: "2026-04-09T00:00:00Z",
  },
  {
    id: 8,
    description: "Dinner with Friends",
    category: "Food",
    amount: 67.3,
    type: "expense",
    date: "2026-04-16T00:00:00Z",
  },
  {
    id: 9,
    description: "Gym Membership",
    category: "Health",
    amount: 55.0,
    type: "expense",
    date: "2026-04-05T00:00:00Z",
  },
  {
    id: 10,
    description: "Mobile Recharge",
    category: "Utilities",
    amount: 49.99,
    type: "expense",
    date: "2026-04-07T00:00:00Z",
  },
  {
    id: 11,
    description: "Uber Rides",
    category: "Transport",
    amount: 32.5,
    type: "expense",
    date: "2026-04-11T00:00:00Z",
  },
  {
    id: 12,
    description: "Movie Ticket",
    category: "Entertainment",
    amount: 24.75,
    type: "expense",
    date: "2026-04-13T00:00:00Z",
  },
  {
    id: 13,
    description: "Amazon Purchase",
    category: "Shopping",
    amount: 45.99,
    type: "expense",
    date: "2026-04-08T00:00:00Z",
  },
  {
    id: 14,
    description: "Rent Payment",
    category: "Home",
    amount: 1200.0,
    type: "expense",
    date: "2026-04-01T00:00:00Z",
  },
];

// Calculate totals
const calculateTotals = () => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
};

const { totalIncome, totalExpense, balance } = calculateTotals();

// Monthly comparison (mock data for demo)
const getMonthlyChange = () => {
  const lastMonthExpense = 1280;
  const change = totalExpense - lastMonthExpense;
  const percentChange = (change / lastMonthExpense) * 100;
  return {
    amount: Math.abs(change),
    percent: Math.abs(percentChange).toFixed(1),
    isDecrease: change < 0,
  };
};

const expenseChange = getMonthlyChange();

// ============================================
// TRANSACTION LIST COMPONENT (Read Only)
// ============================================
const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-500" />
            Recent Transactions
          </h3>

          <div className="flex gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor:
                        transaction.type === "expense" ? "#fee2e2" : "#d1fae5",
                      color:
                        transaction.type === "expense" ? "#dc2626" : "#10b981",
                    }}
                  >
                    {transaction.type === "expense" ? (
                      <ArrowDownRight size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(transaction.date)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${getCategoryColor(
                            transaction.category
                          )}15`,
                          color: getCategoryColor(transaction.category),
                        }}
                      >
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      transaction.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const Dashboard = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your financial summary.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 text-sm font-medium">Total Balance</p>
            <Wallet size={20} className="text-blue-100" />
          </div>
          <h3 className="text-3xl font-bold">{formatCurrency(balance)}</h3>
          <div className="mt-4 flex items-center text-blue-100 text-xs">
            <TrendingUp size={14} className="mr-1" />
            <span>Income - Expenses</span>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">Monthly Income</p>
            <ArrowUpRight size={20} className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalIncome)}
          </h3>
          <p className="text-green-600 text-xs font-medium mt-2">
            Total this month
          </p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm font-medium">
              Monthly Expenses
            </p>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalExpense)}
          </h3>
          <p
            className={`text-xs font-medium mt-2 ${
              expenseChange.isDecrease ? "text-green-600" : "text-red-600"
            }`}
          >
            {expenseChange.isDecrease ? "↓" : "↑"} {expenseChange.percent}% from
            last month
          </p>
        </div>
      </div>

      {/* Transaction List - Full Width (Read Only) */}
      <div>
        <TransactionList />
      </div>
    </div>
  );
};

export default Dashboard;
