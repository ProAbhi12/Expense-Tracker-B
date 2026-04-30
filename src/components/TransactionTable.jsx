import React from "react";
import { Trash2, Edit2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const TransactionTable = ({
  transactions,
  onDelete,
  onEdit,
  dark,
  categories = [],
}) => {
  const formatRs = (num) => `Rs. ${Math.abs(num).toLocaleString()}`;

  // Helper: Find category color by name (fallback to default if not found)
  const getCategoryColor = (categoryName) => {
    if (!categoryName || !Array.isArray(categories))
      return dark ? "#94a3b8" : "#64748b";

    const category = categories.find(
      (cat) =>
        cat.name?.toLowerCase() === categoryName.toLowerCase() ||
        cat.id === categoryName,
    );

    return category?.color || (dark ? "#94a3b8" : "#64748b");
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div
        className={`p-12 text-center ${dark ? "text-slate-400" : "text-gray-500"}`}
      >
        <p className="text-sm font-medium">No transactions found</p>
        <p className="text-xs opacity-60 mt-1">
          Try adjusting your filters or add a new transaction
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className={dark ? "bg-slate-800" : "bg-gray-50"}>
            <th
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-200" : "text-gray-900"}`}
            >
              Transaction
            </th>
            <th
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-200" : "text-gray-900"}`}
            >
              Category
            </th>
            <th
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-200" : "text-gray-900"}`}
            >
              Date
            </th>
            <th
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-right ${dark ? "text-slate-200" : "text-gray-900"}`}
            >
              Amount
            </th>
            <th
              className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-200" : "text-gray-900"}`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${dark ? "divide-slate-700" : "divide-gray-100"}`}
        >
          {transactions.map((t) => {
            // Get the color for this transaction's category
            const categoryColor = getCategoryColor(t.categoryName);

            return (
              <tr
                key={t.id}
                className={`transition-colors ${dark ? "hover:bg-slate-800/50" : "hover:bg-gray-50/80"}`}
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
                        className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}
                      >
                        {t.name}
                      </p>
                      <p
                        className={`text-[10px] font-medium uppercase ${dark ? "text-slate-500" : "text-gray-500"}`}
                      >
                        {["Cash", "eSewa", "Khalti", "Mobile Banking"][
                          t.method
                        ] ?? t.method}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category Badge with Dynamic Color */}
                <td className="px-6 py-4">
                  <span
                    className="px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase border whitespace-nowrap"
                    style={{
                      borderColor: categoryColor,
                      color: categoryColor,
                      backgroundColor: dark
                        ? `${categoryColor}5`
                        : `${categoryColor}10`, // 15% opacity background
                    }}
                  >
                    {t.categoryName}
                  </span>
                </td>

                <td
                  className={`px-6 py-4 text-sm font-medium ${dark ? "text-slate-400" : "text-gray-600"}`}
                >
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-bold text-right ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}
                >
                  {t.type === "INCOME" ? "+" : "-"} {formatRs(t.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      className={`p-2 rounded-lg transition-colors ${dark ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(t.id, t.type)}
                      className={`p-2 rounded-lg transition-colors ${dark ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
