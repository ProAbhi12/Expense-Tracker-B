import React from 'react';

export default function TransactionFilters({ 
  filterType, 
  setFilterType, 
  searchTerm, 
  setSearchTerm,
  dark,
}) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl border transition ${
        dark
          ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name, category or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            dark
              ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-5 py-3 rounded-lg font-medium transition-all ${
            filterType === "ALL" 
              ? "bg-blue-600 text-white" 
              : dark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("INCOME")}
          className={`px-5 py-3 rounded-lg font-medium transition-all ${
            filterType === "INCOME" 
              ? "bg-green-600 text-white" 
              : dark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setFilterType("EXPENSE")}
          className={`px-5 py-3 rounded-lg font-medium transition-all ${
            filterType === "EXPENSE" 
              ? "bg-red-600 text-white" 
              : dark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Expense
        </button>
      </div>
    </div>
  );
}