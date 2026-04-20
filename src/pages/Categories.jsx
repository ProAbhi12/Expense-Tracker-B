import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../ThemeContext";

const expenseData = [
  { name: "Food", value: 400 },
  { name: "Rent", value: 1200 },
  { name: "Transport", value: 300 },
  { name: "Shopping", value: 500 },
];

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;
const INCOLORS = ["#0072fd", "#d4295f"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Categories = () => {
  const { dark } = useTheme();

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Categories</h1>
        <p className={`mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}>View category-wise expense distribution.</p>
      </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
                Expense Distribution
              </h3>
              <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-gray-500"}`}>
                By spending categories
              </p>
            </div>
            <TrendingUp size={18} className="text-blue-500" />
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  label={renderPercentLabel}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => {
                    const total = expenseData.reduce((sum, e) => sum + e.value, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return [`${value} (${percent}%)`, name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



    </div>
  );
};

export default Categories;
