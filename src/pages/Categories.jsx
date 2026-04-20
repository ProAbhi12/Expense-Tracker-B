import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const expenseData = [
  { name: "Food", value: 400 },
  { name: "Rent", value: 1200 },
  { name: "Transport", value: 300 },
  { name: "Shopping", value: 500 },
];

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const INCOLORS = ["#0072fd", "#d4295f"];
const Categories = () => {
  return (
    <div className="space-y-6 pb-8">
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                  <text
                  x="50%"
                  y="10%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  Expense Distribution Chart
                </text>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  label={renderPercentLabel}
                  outerRadius={100}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name, props) => {
                    const total = expenseData.reduce((sum, e) => sum + e.value, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return [`${value} (${percent}%)`, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



    </div>
  );
};

export default Categories;
