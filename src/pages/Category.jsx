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
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import categoryData from '../dummyData/categoryData.json';

const CATEGORY_OPTIONS = categoryData.categoryOptions;

const defaultOption = CATEGORY_OPTIONS[0];
const getCategoryIcon = categoryName => CATEGORY_OPTIONS.find(item => item.category === categoryName)?.icon || '🧾';
const COLOR_SWATCHES = categoryData.colorSwatches;
const COLORS = COLOR_SWATCHES;
const renderPercentLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;
const trendMultipliers = categoryData.trendMultipliers;
const formatRs = amount => `Rs. ${new Intl.NumberFormat('en-NP', {
  maximumFractionDigits: 2,
}).format(amount)}`;
const parseAmountInput = value => {
  const sanitized = value.replace(/,/g, '').trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const AddBudgetModal = ({ onClose, gradient }) => {
  const { addBudget } = useApp();
  const { dark } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(defaultOption.category);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    category: defaultOption.category,
    budget: '',
    color: defaultOption.color,
  });

  const set = e => {
    setError('');
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onPresetChange = e => {
    const categoryName = e.target.value;
    setSelectedPreset(categoryName);

    if (categoryName === 'custom') {
      setError('');
      setForm(p => ({ ...p, category: '' }));
      return;
    }

    const option = CATEGORY_OPTIONS.find(item => item.category === categoryName);
    if (!option) return;

    setForm(p => ({
      ...p,
      category: option.category,
      color: option.color,
    }));
    setError('');
  };

  const onSubmit = () => {
    const category = form.category.trim();
    const budgetValue = parseAmountInput(form.budget);

    if (!category) {
      setError('Please enter a category name.');
      return;
    }

    if (!Number.isFinite(budgetValue) || budgetValue <= 0) {
      setError('Please enter a valid amount greater than 0. You can also use comma format like 1,500.');
      return;
    }

    addBudget({
      category,
      budget: budgetValue,
      color: form.color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 ${gradient ? "border-purple-700/40 bg-slate-900/60" : dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white"} shadow-2xl`} onClick={e => e.stopPropagation()}>
        <h2 className={`mb-5 text-xl font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>Add Budget Category</h2>

        <div className="mb-4">
          <label className={`mb-2 block text-sm font-medium ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-slate-600"}`}>Category</label>
          <select
            value={selectedPreset}
            onChange={onPresetChange}
            className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${gradient ? "border-purple-700/50 bg-slate-800/50 text-white" : dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-800"}`}
          >
            {CATEGORY_OPTIONS.map(item => (
              <option key={item.category} value={item.category}>
                {item.icon} {item.category}
              </option>
            ))}
            <option value="custom">Custom Category</option>
          </select>
        </div>

        {selectedPreset === 'custom' && (
          <div className="mb-4">
            <label className={`mb-2 block text-sm font-medium ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-slate-600"}`}>Custom Category Name</label>
            <input
              name="category"
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${gradient ? "border-purple-700/50 bg-slate-800/50 text-white" : dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-800"}`}
              value={form.category}
              onChange={set}
              placeholder="e.g. Groceries"
            />
          </div>
        )}

        <div className="mb-4">
          <div>
            <label className={`mb-2 block text-sm font-medium ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-slate-600"}`}>Budget Amount (Rs.)</label>
            <input
              name="budget"
              type="text"
              inputMode="decimal"
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${gradient ? "border-purple-700/50 bg-slate-800/50 text-white placeholder:text-purple-300" : dark ? "border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400" : "border-slate-300 bg-white text-slate-800"}`}
              value={form.budget}
              onChange={set}
              placeholder="e.g. 1,500"
            />
          </div>
        </div>

        {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-600">Color</label>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, color }))}
                  className="h-7 w-7 rounded-full border-2 transition"
                  style={{
                    background: color,
                    borderColor: form.color === color ? '#0f172a' : '#ffffff',
                    boxShadow: form.color === color ? '0 0 0 2px #cbd5e1' : '0 1px 2px rgba(15, 23, 42, 0.15)',
                  }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                name="color"
                type="color"
                value={form.color}
                onChange={set}
                className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
              />
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: form.color }} />
                {form.color}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition ${gradient ? "border-purple-700/50 bg-slate-800/50 text-purple-200 hover:bg-purple-600/20" : dark ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"}`} onClick={onClose}>Cancel</button>
          <button
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            onClick={onSubmit}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

const BudgetCard = ({ budget, gradient }) => {
  const { getSpentByCategory, deleteBudget } = useApp();
  const { dark } = useTheme();
  const icon = getCategoryIcon(budget.category);
  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const pct = Math.min((spent / budget.budget) * 100, 100);
  const over = spent > budget.budget;

  return (
    <div className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${gradient ? "border-purple-700/40 bg-slate-900/40 shadow-[0_8px_24px_rgba(147,51,234,0.15)] hover:shadow-[0_12px_30px_rgba(147,51,234,0.25)]" : dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)] hover:shadow-[0_12px_30px_rgba(148,163,184,0.18)]" : "border-slate-200 bg-white shadow-sm hover:shadow-md"}`}>
      <div className="mb-3 flex items-center gap-3">
        <div>
          <h3 className={`text-base font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>{icon} {budget.category}</h3>
          <div className={`mt-1 flex items-center gap-2 text-xs ${gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-slate-500"}`}>
            <span>Budget: {formatRs(budget.budget)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ background: budget.color }} />
              Theme
            </span>
          </div>
        </div>
        <button className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100" onClick={() => deleteBudget(budget.id)}>
          <Trash2 size={14} />
        </button>
      </div>

      <div className={`mb-3 text-sm font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-800"}`}>
        Spent: {formatRs(spent)} / Remaining:{' '}
        <span style={{ color: over ? '#ef4444' : 'inherit' }}>
          {formatRs(Math.abs(remaining))}{over ? ' (over!)' : ''}
        </span>
      </div>

      <div className={`mb-2 h-2 w-full overflow-hidden rounded-full ${gradient ? "bg-slate-800/50" : dark ? "bg-slate-700" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: over ? '#ef4444' : pct > 75 ? '#f59e0b' : budget.color,
          }}
        />
      </div>

      <div className={`flex justify-between gap-2 text-xs ${gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-slate-500"}`}>
        <span>{Math.round(pct)}% of budget</span>
        <span>{formatRs(Math.max(remaining, 0))} left</span>
      </div>
    </div>
  );
};

const Budgets = () => {
  const { budgets } = useApp();
  const { dark, gradient } = useTheme();
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
        <h2 className={`m-0 text-xl font-bold tracking-tight ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>Budget Categories</h2>
        <button className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${dark ? "border-blue-400/30 bg-blue-500/15 text-blue-300 hover:bg-blue-600 hover:text-white" : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"}`} onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets.map(b => <BudgetCard key={b.id} budget={b} gradient={gradient} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
<div className={`rounded-2xl border p-5 ${gradient ? "border-purple-700/40 bg-slate-900/40" : dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-1 text-base font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>Budget Distribution</h3>
        <p className={`mb-4 text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-slate-500"}`}>Based on category budget amounts</p>

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
                <Tooltip formatter={(value, name) => [`Rs. ${Number(value).toFixed(2)}`, name]} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${gradient ? "border-purple-700/40 bg-slate-900/40" : dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-1 text-base font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>Budget Trend</h3>
          <p className={`mb-3 text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-slate-500"}`}>Daily / Weekly / Monthly / Yearly</p>

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
                    : gradient
                      ? 'bg-slate-800/50 border-purple-700/50 text-purple-100 hover:bg-slate-700/50'
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
                <Tooltip formatter={(value) => [`Rs. ${Number(value).toFixed(2)}`, 'Budget']} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" name="Budget" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 mx-auto rounded-2xl border p-5 ${gradient ? "border-purple-700/40 bg-slate-900/40" : dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className={`mb-1 text-base font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>Budget Bar Graph</h3>
        <p className={`mb-4 text-xs ${gradient ? "text-purple-200" : dark ? "text-slate-400" : "text-slate-500"}`}>Budget values across categories</p>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={budgetChartData} margin={{ top: 8, right: 18, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" stroke={axisStroke} tickLine={false} axisLine={false} />
              <YAxis stroke={axisStroke} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`Rs. ${Number(value).toFixed(2)}`, 'Budget']} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="value" name="Budget" radius={[8, 8, 0, 0]}>
                {budgetChartData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} gradient={gradient} />}
    </div>
  );
};

export default Budgets;
