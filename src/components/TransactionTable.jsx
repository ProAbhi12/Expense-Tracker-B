import React from "react";

export default function TransactionTable({ transactions, dark }) {
  const getTypeColor = (type) => {
    return type === "INCOME"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition ${
        dark
          ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <table className="w-full">
        <thead
          className={`${dark ? "bg-slate-800 border-b border-slate-700" : "bg-gray-50 border-b"}`}
        >
          <tr>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Date
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Description
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Category
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Source
            </th>
            <th
              className={`px-6 py-4 text-left text-sm font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Method
            </th>
            <th
              className={`px-6 py-4 text-right text-sm font-semibold ${dark ? "text-slate-300" : "text-gray-600"}`}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className={dark ? "divide-y divide-slate-700" : "divide-y"}>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className={`transition-colors ${dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}
            >
              <td
                className={`px-6 py-5 text-sm ${dark ? "text-slate-400" : "text-gray-600"}`}
              >
                {formatDate(tx.date)}
              </td>
              <td
                className={`px-6 py-5 font-medium ${dark ? "text-slate-100" : "text-gray-800"}`}
              >
                {tx.name}
              </td>

              <td className="px-6 py-5">
                <span
                  className={`text-sm ${dark ? "text-slate-300" : "text-gray-700"}`}
                >
                  {tx?.categoryName ?? tx?.category ?? "Uncategorized"}
                </span>
              </td>

              <td
                className={`px-6 py-5 text-sm ${dark ? "text-slate-400" : "text-gray-600"}`}
              >
                {tx.source}
              </td>
              <td className="px-6 py-5">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${dark ? "bg-slate-700 text-slate-200" : "bg-gray-100 text-gray-600"}`}
                >
                  {tx.method}
                </span>
              </td>
              <td className="px-6 py-5 text-right font-semibold">
                <span
                  className={
                    tx.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  Rs. {tx.amount.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && (
        <div
          className={`text-center py-12 ${dark ? "text-slate-400" : "text-gray-500"}`}
        >
          No transactions found
        </div>
      )}
    </div>
  );
}
