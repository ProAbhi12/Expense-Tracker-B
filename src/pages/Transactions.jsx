import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import AddTransactionModal from "../components/AddTransactionModal";

const Transactions = () => {
  const { dark } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://localhost:7197/api/Transactions/alltransactions",
      );
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 2. Filter Logic
  const filteredData = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatRs = (num) => `Rs. ${Math.abs(num).toLocaleString()}`;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}
          >
            Transactions
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Detailed history of your financial activities.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          <span>New Transaction</span>
        </button>
      </div>

      <div
        className={`rounded-xl border shadow-sm overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200"}`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`flex items-center space-x-1 px-3 py-2 border rounded-lg text-xs font-medium ${dark ? "bg-slate-800 border-slate-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"}`}
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={dark ? "bg-slate-800/50" : "bg-gray-50"}>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Transaction
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                  Amount
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${dark ? "divide-slate-800" : "divide-gray-100"}`}
            >
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-gray-400 italic"
                  >
                    Loading from SQL Server...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((t) => (
                  <tr
                    key={t.id}
                    className={`transition-colors ${dark ? "hover:bg-slate-800/50" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === "INCOME" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {t.type === "INCOME" ? (
                            <ArrowUpCircle size={18} />
                          ) : (
                            <ArrowDownCircle size={18} />
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}
                        >
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-[10px] font-black rounded-full uppercase border ${dark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}
                      >
                        {t.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-black text-right ${t.type === "INCOME" ? "text-green-600" : "text-red-500"}`}
                    >
                      {t.type === "INCOME" ? "+" : "-"} {formatRs(t.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={() => fetchTransactions()}
        dark={dark}
      />
    </div>
  );
};

export default Transactions;
