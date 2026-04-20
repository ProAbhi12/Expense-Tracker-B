import React from 'react';

export default function TransactionFilters({ 
  filterType, 
  setFilterType, 
  searchTerm, 
  setSearchTerm 
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name, category or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-5 py-3 rounded-lg font-medium transition-all ${
            filterType === "ALL" 
              ? "bg-blue-600 text-white" 
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
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Expense
        </button>
      </div>
    </div>
  );
}