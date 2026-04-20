import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const renderPercentLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

const trendMultipliers = {
  daily: 0.08,
  weekly: 0.35,
  monthly: 1,
  yearly: 12,
};

const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
  const { dark } = useTheme();
  const [form, setForm] = useState({ category: '', budget: '', icon: '💰', color: '#3b82f6' });

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white"} shadow-2xl`} onClick={e => e.stopPropagation()}>
        <h2 className={`mb-5 text-xl font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>Add Budget Category</h2>

        <div className="mb-4">
          <label className={`mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>Category Name</label>
          <input
            name="category"
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-800"}`}
            value={form.category}
            onChange={set}
            placeholder="e.g. Groceries"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="mb-4 sm:mb-0">
            <label className={`mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>Budget Amount ($)</label>
            <input
              name="budget"
              type="number"
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-800"}`}
              value={form.budget}
              onChange={set}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={`mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>Icon (emoji)</label>
            <input
              name="icon"
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-800"}`}
              value={form.icon}
              onChange={set}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className={`mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(p => ({ ...p, color: c }))}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', outline: form.color === c ? '3px solid white' : 'none' }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition ${dark ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"}`} onClick={onClose}>Cancel</button>
          <button
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            onClick={() => {
              if (!form.category || !form.budget) return;
              addBudget({ ...form, budget: parseFloat(form.budget) });
              onClose();
            }}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

const BudgetCard = ({ budget }) => {
  const { getSpentByCategory, deleteBudget } = useApp();
  const { dark } = useTheme();
  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const pct = Math.min((spent / budget.budget) * 100, 100);
  const over = spent > budget.budget;

  return (
    <div className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)] hover:shadow-[0_12px_30px_rgba(148,163,184,0.18)]" : "border-slate-200 bg-white shadow-sm hover:shadow-md"}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: `${budget.color}22` }}>{budget.icon}</div>
        <div>
          <h3 className={`text-base font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>{budget.category}</h3>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Budget: ${budget.budget.toFixed(2)}</p>
        </div>
        <button className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100" onClick={() => deleteBudget(budget.id)}>
          <Trash2 size={14} />
        </button>
      </div>

      <div className={`mb-3 text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>
        Spent: ${spent.toFixed(2)} / Remaining:{' '}
        <span style={{ color: over ? '#ef4444' : 'inherit' }}>
          ${Math.abs(remaining).toFixed(2)}{over ? ' (over!)' : ''}
        </span>
      </div>

      <div className={`mb-2 h-2 w-full overflow-hidden rounded-full ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: over ? '#ef4444' : pct > 75 ? '#f59e0b' : budget.color,
          }}
        />
      </div>

      <div className={`flex justify-between gap-2 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
        <span>{Math.round(pct)}% of budget</span>
        <span>${Math.max(remaining, 0).toFixed(2)} left</span>
      </div>
    </div>
  );
};

const Budgets = () => {
  const { budgets } = useApp();
  const { dark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [trendRange, setTrendRange] = useState('monthly');
  const axisStroke = dark ? '#94a3b8' : '#64748b';
  const gridStroke = dark ? '#334155' : '#e2e8f0';

  const budgetChartData = budgets.map((item, index) => ({
    name: item.category,
    value: Number(item.budget) || 0,
    color: item.color || COLORS[index % COLORS.length],
  }));

  const trendData = budgetChartData.map((item) => ({
    label: item.name,
    value: Number((item.value * trendMultipliers[trendRange]).toFixed(2)),
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className={`m-0 text-xl font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>Budget Categories</h2>
        <button className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${dark ? "border-blue-400/30 bg-blue-500/15 text-blue-300 hover:bg-blue-600 hover:text-white" : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"}`} onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets.map(b => <BudgetCard key={b.id} budget={b} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={`rounded-2xl border p-5 ${dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-1 text-base font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>Budget Distribution</h3>
          <p className={`mb-4 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Based on category budget amounts</p>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={budgetChartData}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  label={renderPercentLabel}
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {budgetChartData.map((entry, index) => (
                    <Cell key={`budget-cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-1 text-base font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>Budget Trend</h3>
          <p className={`mb-3 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Daily / Weekly / Monthly / Yearly</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
              { key: 'yearly', label: 'Yearly' },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTrendRange(range.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  trendRange === range.key
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : dark
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 8, right: 18, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="label" stroke={axisStroke} tickLine={false} axisLine={false} />
                <YAxis stroke={axisStroke} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Budget']} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" name="Budget" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Budgets;
