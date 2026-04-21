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
const COLOR_SWATCHES = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#334155'];

const trendMultipliers = {
  daily: 0.08,
  weekly: 0.35,
  monthly: 1,
  yearly: 12,
};

const formatCurrency = amount => `Rs. ${amount.toLocaleString()}`;

const parseAmountInput = value => {
  const sanitized = value.toString().replace(/,/g, '').trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const getCategoryIcon = (categoryName) => {
  const option = CATEGORY_OPTIONS.find(item => item.category === categoryName);
  return option ? option.icon : '🧾';
};

// ========== STYLE HELPERS ==========
const getModalStyles = (dark) => ({
  backdrop: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm",
  container: `w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all animate-in zoom-in duration-200 ${dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white"}`,
  title: `mb-5 text-xl font-bold ${dark ? "text-slate-100" : "text-slate-900"}`,
  label: `mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`,
  input: `w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${dark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-300 bg-white text-slate-800"}`,
});

// ========== ADD BUDGET MODAL COMPONENT ==========
const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
  const { dark } = useTheme();
  const styles = getModalStyles(dark);
  const [selectedPreset, setSelectedPreset] = useState(defaultOption.category);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    category: defaultOption.category,
    budget: '',
    color: defaultOption.color,
  });

  const updateForm = e => {
    setError('');
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onPresetChange = e => {
    const categoryName = e.target.value;
    setSelectedPreset(categoryName);

    if (categoryName === 'custom') {
      setForm(p => ({ ...p, category: '', color: COLOR_SWATCHES[0] }));
      return;
    }

    const option = CATEGORY_OPTIONS.find(item => item.category === categoryName);
    if (!option) return;

    setForm({
      category: option.category,
      budget: form.budget,
      color: option.color,
    });
  };

  const onSubmit = () => {
    const category = form.category.trim();
    const budgetValue = parseAmountInput(form.budget);

    if (!category) {
      setError('Please enter a category name.');
      return;
    }

    if (!Number.isFinite(budgetValue) || budgetValue <= 0) {
      setError('Please enter a valid amount.');
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

        <div className="mb-4">
          <label className={styles.label}>Select Category</label>
          <select
            value={selectedPreset}
            onChange={onPresetChange}
            className={styles.input}
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
            <label className={styles.label}>Category Name</label>
            <input
              name="category"
              className={styles.input}
              value={form.category}
              onChange={updateForm}
              placeholder="e.g. Groceries"
            />
          </div>
        )}

        <div className="mb-4">
          <label className={styles.label}>Budget Amount (Rs.)</label>
          <input
            name="budget"
            type="text"
            className={styles.input}
            value={form.budget}
            onChange={updateForm}
            placeholder="e.g. 1500"
          />
        </div>

        {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

        <div className="mb-6">
          <label className={styles.label}>Category Color</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COLOR_SWATCHES.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm(p => ({ ...p, color }))}
                className={`h-7 w-7 rounded-full border-2 transition ${form.color === color ? 'border-slate-900 scale-110' : 'border-white'}`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800" onClick={onClose}>Cancel</button>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20" onClick={onSubmit}>Save Category</button>
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
    <div className={`rounded-2xl border p-5 transition hover:shadow-md ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className={`text-base font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>{budget.category}</h3>
            <p className="text-xs text-slate-500 font-medium">Budget: {formatCurrency(budget.budget)}</p>
          </div>
        </div>
        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" onClick={() => deleteBudget(budget.id)}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className={`mb-4 h-2 w-full rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <div className="h-full transition-all duration-500" style={{ width: `${percentage}%`, background: isOver ? '#ef4444' : budget.color }} />
      </div>

      <div className="flex justify-between text-xs font-bold">
        <span className={isOver ? 'text-red-500' : 'text-slate-500'}>{Math.round(percentage)}% used</span>
        <span className={isOver ? 'text-red-500' : 'text-green-600'}>{isOver ? `Rs. ${Math.abs(remaining)} over!` : `${formatCurrency(remaining)} left`}</span>
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

  const chartData = budgets.map(item => ({
    name: item.category,
    value: item.budget,
    color: item.color
  }));

  const trendData = budgets.map(item => ({
    label: item.category,
    value: item.budget * trendMultipliers[trendRange]
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>Budget Categories</h2>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets.map(budget => <BudgetCard key={budget.id} budget={budget} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className={`rounded-2xl border p-6 ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
          <h3 className={`font-bold mb-4 ${dark ? "text-slate-100" : "text-gray-800"}`}>Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Trend</h3>
            <div className="flex gap-1">
              {['daily', 'weekly', 'monthly', 'yearly'].map(range => (
                <button key={range} onClick={() => setTrendRange(range)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${trendRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="label" stroke={axisStroke} tick={{fontSize: 10}} />
                <YAxis stroke={axisStroke} tick={{fontSize: 10}} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
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
