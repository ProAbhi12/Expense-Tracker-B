import React from 'react';

export default function TransactionTable({ transactions, dark, gradient }) {
  const getTypeColor = (type) => (type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700");

  const formatTypeLabel = (type) =>
    String(type || "")
      .toLowerCase()
      .replace(/^./, (char) => char.toUpperCase());

  const formatMethod = (method) =>
    String(method || "")
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => `Rs. ${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const getSignedAmount = (tx) =>
    tx.type === "INCOME" ? Number(tx.amount) : -Number(tx.amount);

  const balanceById = (() => {
    const ordered = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const map = new Map();
    let runningBalance = 0;

    ordered.forEach((tx) => {
      runningBalance += getSignedAmount(tx);
      map.set(tx.id, runningBalance);
    });

    return map;
  })();

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition ${
        gradient
          ? "bg-slate-900/40 border-purple-700/40 backdrop-blur-sm shadow-[0_8px_24px_rgba(147,51,234,0.15)]"
          : dark
          ? "bg-slate-900 border-slate-700 shadow-[0_8px_24px_rgba(148,163,184,0.12)]"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="hidden md:block overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <thead className={`${gradient ? "bg-slate-800/70 border-b border-purple-700/40" : dark ? "bg-slate-800 border-b border-slate-700" : "bg-gray-50 border-b"}`}>
          <tr>
            <th className={`px-6 py-4 text-left text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Date</th>
            <th className={`px-6 py-4 text-left text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Type</th>
            <th className={`px-6 py-4 text-left text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Description</th>
            <th className={`px-6 py-4 text-left text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Category</th>
            <th className={`px-6 py-4 text-left text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Method</th>
            <th className={`px-6 py-4 text-right text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Balance</th>
            <th className={`px-6 py-4 text-right text-sm font-semibold ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-600"}`}>Amount</th>
          </tr>
        </thead>
        <tbody className={gradient ? "divide-y divide-purple-700/30" : dark ? "divide-y divide-slate-700" : "divide-y"}>
          {transactions.map((tx) => (
            <tr key={tx.id} className={`transition-colors ${gradient ? "hover:bg-purple-800/20" : dark ? "hover:bg-slate-800/70" : "hover:bg-gray-50"}`}>
              <td className={`px-6 py-5 text-sm ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-gray-600"}`}>
                {formatDateTime(tx.date)}
              </td>
              <td className="px-6 py-5">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getTypeColor(tx.type)}`}>
                  {formatTypeLabel(tx.type)}
                </span>
              </td>
              <td className={`px-6 py-5 font-medium ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
                {tx.name}
              </td>
              <td className="px-6 py-5">
                <span className={`text-xs px-2.5 py-1 rounded-full ${gradient ? "bg-purple-700/30 text-purple-100" : dark ? "bg-slate-700 text-slate-200" : "bg-gray-100 text-gray-700"}`}>
                  {tx?.category?.name ?? tx?.category ?? "Uncategorized"}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className={`text-xs px-3 py-1 rounded-full ${gradient ? "bg-purple-700/30 text-purple-100" : dark ? "bg-slate-700 text-slate-200" : "bg-gray-100 text-gray-600"}`}>
                  {formatMethod(tx.reason)}
                </span>
              </td>
              <td className="px-6 py-5 text-right font-semibold">
                <span className={(balanceById.get(tx.id) ?? 0) >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(balanceById.get(tx.id) ?? 0)}
                </span>
              </td>
              <td className="px-6 py-5 text-right font-semibold">
                <span className={gradient ? "text-white" : dark ? "text-slate-200" : "text-gray-800"}>
                  {formatCurrency(tx.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className={`md:hidden divide-y ${gradient ? "divide-purple-700/30" : dark ? "divide-slate-700" : "divide-slate-200"}`}>
        {transactions.map((tx) => (
          <div key={tx.id} className={`p-4 ${gradient ? "bg-slate-900/20" : dark ? "bg-slate-900" : "bg-white"}`}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div className="col-span-1">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Date</p>
                <p className={`mt-1 font-medium ${gradient ? "text-purple-100" : dark ? "text-slate-200" : "text-gray-700"}`}>{formatDateTime(tx.date)}</p>
              </div>
              <div className="col-span-1">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Type</p>
                <div className="mt-1">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getTypeColor(tx.type)}`}>
                    {formatTypeLabel(tx.type)}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Description</p>
                <p className={`mt-1 font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>{tx.name}</p>
              </div>

              <div className="col-span-1">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Category</p>
                <p className={`mt-1 font-medium ${gradient ? "text-purple-100" : dark ? "text-slate-200" : "text-gray-700"}`}>{tx?.category?.name ?? tx?.category ?? "Uncategorized"}</p>
              </div>
              <div className="col-span-1">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Method</p>
                <p className={`mt-1 font-medium ${gradient ? "text-purple-100" : dark ? "text-slate-200" : "text-gray-700"}`}>{formatMethod(tx.reason)}</p>
              </div>

              <div className="col-span-1">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Balance</p>
                <p className={`mt-1 font-semibold ${(balanceById.get(tx.id) ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(balanceById.get(tx.id) ?? 0)}
                </p>
              </div>
              <div className="col-span-1">
                <p className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}>Amount</p>
                <p className={`mt-1 font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className={`text-center py-12 ${gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-500"}`}>
          No transactions found
        </div>
      )}
    </div>
  );
}
