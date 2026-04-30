import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import TransactionTable from "../components/TransactionTable";
import TransactionFilters from "../components/TransactionFilters";
import AddTransactionModal from "../components/AddTransactionModal";

const API_BASE_URL = "https://localhost:7197/api";

const Transactions = () => {
  const { dark } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/Transactions/alltransactions`,
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://localhost:7197/api/Category");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);
  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const controller = type === "INCOME" ? "Income" : "Expense";
    try {
      const response = await fetch(`${API_BASE_URL}/${controller}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchTransactions();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Filter transactions
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === "ALL" || t.type === filterType;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        (t.name || "").toLowerCase().includes(q) ||
        (t.categoryName || "").toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className={`space-y-6 pb-20 ${dark ? "text-white" : "text-gray-800"}`}>
      {/* <div
      className={`pt-4 pl-4 pr-4 pb-6 space-y-4 min-h-screen ${dark ? "bg-slate-900 text-white" : "bg-gray-50"}`}
    > */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-sm opacity-60 font-medium tracking-tight">
            Manage your financial logs
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
        >
          + Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Balance
          </p>
          <p className="text-2xl font-black text-blue-600">
            Rs. {(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Income
          </p>
          <p className="text-2xl font-black text-green-600">
            Rs. {totalIncome.toLocaleString()}
          </p>
        </div>
        <div
          className={`p-6 rounded-2xl border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Expense
          </p>
          <p className="text-2xl font-black text-red-500">
            Rs. {totalExpense.toLocaleString()}
          </p>
        </div>
      </div>

      <TransactionFilters
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dark={dark}
      />

      {loading ? (
        <div className="p-20 text-center text-gray-400 italic">
          Syncing with SQL Server...
        </div>
      ) : (
        <div
          className={`rounded-xl border shadow-sm overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
        >
          <TransactionTable
            transactions={paginatedData}
            onDelete={handleDelete}
            onEdit={handleEdit}
            dark={dark}
             categories={categories} 
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t ${dark ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-gray-50"}`}
            >
              {/* Items per page selector */}
              <div className="flex items-center gap-2 text-sm">
                <span className={dark ? "text-slate-400" : "text-gray-600"}>
                  Show:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    dark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className={dark ? "text-slate-400" : "text-gray-600"}>
                  of {filteredData.length} results
                </span>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : dark
                        ? "hover:bg-slate-700 text-slate-300"
                        : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span
                        className={`px-3 py-2 text-sm ${dark ? "text-slate-500" : "text-gray-400"}`}
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : dark
                              ? "hover:bg-slate-700 text-slate-300"
                              : "hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : dark
                        ? "hover:bg-slate-700 text-slate-300"
                        : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Page info for mobile */}
              <div
                className={`text-sm ${dark ? "text-slate-400" : "text-gray-600"} sm:hidden`}
              >
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={fetchTransactions}
        editingData={editingTransaction}
        dark={dark}
      />
    </div>
  );
};

export default Transactions;
