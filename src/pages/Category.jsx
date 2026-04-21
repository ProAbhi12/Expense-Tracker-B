import React, { useState } from 'react';
import { 
  Plus, Trash2, UtensilsCrossed, Car, Home, Film, 
  ShoppingCart, Lightbulb, Heart, BookOpen 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_OPTIONS = [
  { category: 'Food', icon: '🍔', color: '#ef4444' },
  { category: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { category: 'Housing', icon: '🏠', color: '#f59e0b' },
  { category: 'Entertainment', icon: '🎬', color: '#10b981' },
  { category: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
  { category: 'Utilities', icon: '💡', color: '#06b6d4' },
  { category: 'Health', icon: '💊', color: '#ec4899' },
  { category: 'Education', icon: '📚', color: '#f97316' },
];

const defaultOption = CATEGORY_OPTIONS[0];
const getCategoryIcon = categoryName => CATEGORY_OPTIONS.find(item => item.category === categoryName)?.icon || '🧾';
const COLOR_SWATCHES = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#334155'];
const COLORS = COLOR_SWATCHES;
const renderPercentLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;
const trendMultipliers = {
  daily: 0.08,
  weekly: 0.35,
  monthly: 1,
  yearly: 12,
};
const formatNPR = amount => new Intl.NumberFormat('en-NP', {
  style: 'currency',
  currency: 'NPR',
  maximumFractionDigits: 2,
}).format(amount);
const parseAmountInput = value => {
  const sanitized = value.replace(/,/g, '').trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

/**
 * Get icon and color for any category (preset or custom)
 */
const getCategoryIcon = (categoryName) => {
  // Check if it's a preset category
  const preset = CATEGORY_OPTIONS.find(item => item.category === categoryName);
  if (preset) {
    return { icon: getIconComponent(preset.category), color: preset.color };
  }
  
  // If not preset, use smart icon for custom
  return getSmartIconForCustom(categoryName);
};

/**
 * Smart icon matching for custom categories - matches keywords
 * Returns { icon: IconComponent, color: string }
 */
const getSmartIconForCustom = (categoryName) => {
  const name = categoryName.toLowerCase().trim();
  
  // Transportation keywords
  if (['petrol', 'gas', 'fuel', 'diesel', 'car', 'bike', 'auto', 'taxi', 'parking', 'toll'].some(keyword => name.includes(keyword))) {
    return { icon: Car, color: '#3b82f6' };
  }
  
  // Food keywords
  if (['food', 'grocery', 'groceries', 'eat', 'meal', 'restaurant', 'pizza', 'burger', 'snack'].some(keyword => name.includes(keyword))) {
    return { icon: UtensilsCrossed, color: '#ef4444' };
  }
  
  // Utilities keywords
  if (['electricity', 'water', 'power', 'bill', 'internet', 'wifi', 'mobile', 'phone'].some(keyword => name.includes(keyword))) {
    return { icon: Lightbulb, color: '#06b6d4' };
  }
  
  // Entertainment keywords
  if (['movie', 'game', 'gaming', 'movie', 'party', 'play', 'fun', 'hobby', 'concert', 'show'].some(keyword => name.includes(keyword))) {
    return { icon: Film, color: '#10b981' };
  }
  
  // Health keywords
  if (['doctor', 'medicine', 'health', 'fitness', 'gym', 'workout', 'medicine', 'hospital'].some(keyword => name.includes(keyword))) {
    return { icon: Heart, color: '#ec4899' };
  }
  
  // Shopping keywords
  if (['shopping', 'buy', 'clothes', 'shoes', 'dress', 'fashion', 'store', 'mall'].some(keyword => name.includes(keyword))) {
    return { icon: ShoppingCart, color: '#8b5cf6' };
  }
  
  // Housing keywords
  if (['rent', 'home', 'house', 'room', 'apartment', 'mortgage', 'property'].some(keyword => name.includes(keyword))) {
    return { icon: Home, color: '#f59e0b' };
  }
  
  // Education keywords
  if (['book', 'study', 'course', 'learn', 'school', 'college', 'education', 'tuition'].some(keyword => name.includes(keyword))) {
    return { icon: BookOpen, color: '#f97316' };
  }
  
  // Default fallback
  return { icon: BookOpen, color: '#9ca3af' };
};

const formatNPR = (amount) => new Intl.NumberFormat('en-NP', {
  style: 'currency', currency: 'NPR', maximumFractionDigits: 2,
}).format(amount);

const renderPercentLabel = (entry) => entry.percent ? `${entry.percent}%` : '0%';

// ========== STYLE HELPERS ==========
const getModalStyles = (dark) => ({
  backdrop: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm",
  container: `w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white"}`,
  title: `mb-5 text-xl font-bold ${dark ? "text-slate-100" : "text-slate-900"}`,
  label: `mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`,
  input: `w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-800"}`,
  colorContainer: `rounded-xl border p-3 ${dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`,
  error: `mb-4 text-sm font-medium ${dark ? "text-red-400" : "text-red-600"}`,
});

// ========== ADD BUDGET MODAL COMPONENT ==========
const AddBudgetModal = ({ onClose }) => {
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
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.container} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Add Budget Category</h2>

        {/* Category Selection with Icons */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
          <select
            value={selectedPreset}
            onChange={onPresetChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
            <label className="mb-2 block text-sm font-medium text-slate-600">Custom Category Name</label>
            <input
              name="category"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={form.category}
              onChange={set}
              placeholder="e.g. Groceries"
            />
          </div>
        )}

        <div className="mb-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Budget Amount (NRP)</label>
            <input
              name="budget"
              type="text"
              inputMode="decimal"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={form.budget}
              onChange={set}
              placeholder="e.g. 1,500"
            />
          </div>
        )}

        {/* Budget Amount Input */}
        <div className="mb-4">
          <label className={styles.label}>Budget Amount (NRP)</label>
          <input
            name="budget"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={form.budget}
            onChange={updateForm}
            placeholder="e.g. 1,500"
          />
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

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button 
            className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition ${dark ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"}`} 
            onClick={onClose}
          >
            Cancel
          </button>
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

// ========== BUDGET CARD COMPONENT ==========
const BudgetCard = ({ budget }) => {
  const { getSpentByCategory, deleteBudget } = useApp();
  const { dark } = useTheme();
  const icon = getCategoryIcon(budget.category);
  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const percentage = Math.min((spent / budget.budget) * 100, 100);
  const isOver = spent > budget.budget;

  return (
    <div className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)] hover:shadow-[0_12px_30px_rgba(148,163,184,0.18)]" : "border-slate-200 bg-white shadow-sm hover:shadow-md"}`}>
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{icon} {budget.category}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>Budget: {formatNPR(budget.budget)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ background: budget.color }} />
              Theme
            </span>
          </div>
        </div>
        <button 
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100" 
          onClick={() => deleteBudget(budget.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mb-3 text-sm font-semibold text-slate-800">
        Spent: {formatNPR(spent)} / Remaining:{' '}
        <span style={{ color: over ? '#ef4444' : 'inherit' }}>
          {formatNPR(Math.abs(remaining))}{over ? ' (over!)' : ''}
        </span>
      </div>

      {/* Progress Bar */}
      <div className={`mb-2 h-2 w-full overflow-hidden rounded-full ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isOver ? '#ef4444' : percentage > 75 ? '#f59e0b' : budget.color,
          }}
        />
      </div>

      {/* Footer Stats */}
      <div className={`flex justify-between gap-2 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
        <span>{Math.round(pct)}% of budget</span>
        <span>{formatNPR(Math.max(remaining, 0))} left</span>
      </div>
    </div>
  );
};

// ========== MAIN BUDGETS PAGE ==========
const Budgets = () => {
  const { budgets } = useApp();
  const { dark } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [trendRange, setTrendRange] = useState('monthly');
  
  const axisStroke = dark ? '#94a3b8' : '#64748b';
  const gridStroke = dark ? '#334155' : '#e2e8f0';

  // Prepare chart data from budgets
  const budgetChartData = budgets.map((item, index) => ({
    name: item.category,
    value: Number(item.budget) || 0,
    color: item.color || COLOR_SWATCHES[index % COLOR_SWATCHES.length],
  }));

  const totalBudget = budgetChartData.reduce((sum, item) => sum + item.value, 0) || 1;
  const chartDataWithPercent = budgetChartData.map((item) => ({
    ...item,
    percent: totalBudget > 0 ? Math.round((item.value / totalBudget) * 100) : 0,
  }));

  // Calculate trend data (daily/weekly/monthly/yearly)
  const trendData = budgetChartData.map((item) => ({
    label: item.name,
    value: Number((item.value * trendMultipliers[trendRange]).toFixed(2)),
  }));

  return (
    <div className="space-y-5">
      {/* Title and Add Button */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className={`m-0 text-xl font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>
          Budget Categories
        </h2>
        <button 
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${dark ? "border-blue-400/30 bg-blue-500/15 text-blue-300 hover:bg-blue-600 hover:text-white" : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"}`} 
          onClick={() => setShowModal(true)}
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets.map(budget => <BudgetCard key={budget.id} budget={budget} />)}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Pie Chart - Budget Distribution */}
        <div className={`rounded-2xl border p-5 ${dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-1 text-base font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>
            Budget Distribution
          </h3>
          <p className={`mb-4 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
            How budgets are split across categories
          </p>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartDataWithPercent}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  label={renderPercentLabel}
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {chartDataWithPercent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLOR_SWATCHES[index % COLOR_SWATCHES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Budget']} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Budget Trend */}
        <div className={`rounded-2xl border p-5 ${dark ? "border-slate-700 bg-slate-900 shadow-[0_8px_24px_rgba(148,163,184,0.12)]" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className={`mb-1 text-base font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>
            Budget Trend
          </h3>
          <p className={`mb-3 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
            View budgets over different time periods
          </p>

          {/* Time Range Buttons */}
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

          {/* Line Chart */}
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 8, right: 18, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="label" stroke={axisStroke} tickLine={false} axisLine={false} />
                <YAxis stroke={axisStroke} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Budget']} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Budget" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Budgets;
