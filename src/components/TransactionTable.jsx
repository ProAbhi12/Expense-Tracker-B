import React from "react";
import { Trash2, Edit2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const TransactionTable = ({ transactions, onDelete, onEdit, dark }) => {
  const formatRs = (num) => `Rs. ${Math.abs(num).toLocaleString()}`;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className={dark ? "bg-slate-800" : "bg-gray-100"}>
            <th
              className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${dark ? "text-slate-100" : "text-black"}`}
            >
              Transaction
            </th>
            <th
              className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${dark ? "text-slate-100" : "text-black"}`}
            >
              Category
            </th>
            <th
              className={`px-6 py-4 text-xs font-black uppercase tracking-widest ${dark ? "text-slate-100" : "text-black"}`}
            >
              Date
            </th>
            <th
              className={`px-6 py-4 text-xs font-black uppercase tracking-widest text-right ${dark ? "text-slate-100" : "text-black"}`}
            >
              Amount
            </th>
            <th
              className={`px-6 py-4 text-center text-xs font-black uppercase tracking-widest ${dark ? "text-slate-100" : "text-black"}`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${dark ? "divide-slate-800" : "divide-gray-200"}`}
        >
          {transactions.map((t) => (
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
                  <div>
                    <p
                      className={`text-sm font-black ${dark ? "text-white" : "text-black"}`}
                    >
                      {t.name}
                    </p>
                    <p className={`text-[10px] font-black uppercase ...`}>
                      {["Cash", "eSewa", "Khalti", "Mobile Banking"][
                        t.method
                      ] ?? t.method}
                    </p>
                    {/* <p className={`text-[10px] font-black uppercase ${dark ? "text-slate-400" : "text-black opacity-60"}`}>{t.method}</p> */}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-[10px] font-black rounded-full uppercase border-2 ${dark ? "border-slate-700 text-slate-100" : "border-gray-900 text-black"}`}
                >
                  {t.categoryName}
                </span>
              </td>
              <td
                className={`px-6 py-4 text-sm font-bold ${dark ? "text-slate-300" : "text-black"}`}
              >
                {new Date(t.date).toLocaleDateString()}
              </td>
              <td
                className={`px-6 py-4 text-sm font-black text-right ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}
              >
                {t.type === "INCOME" ? "+" : "-"} {formatRs(t.amount)}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    className={`p-2 rounded-lg transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-black hover:bg-gray-100"}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(t.id, t.type)}
                    className={`p-2 rounded-lg transition-colors ${dark ? "text-slate-400 hover:text-red-500" : "text-black hover:bg-red-50"}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
