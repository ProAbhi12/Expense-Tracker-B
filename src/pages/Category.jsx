import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

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

const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
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
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="mb-5 text-xl font-bold text-slate-900">Add Budget Category</h2>

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
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50" onClick={onClose}>Cancel</button>
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

const BudgetCard = ({ budget }) => {
  const { getSpentByCategory, deleteBudget } = useApp();
  const icon = getCategoryIcon(budget.category);
  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const pct = Math.min((spent / budget.budget) * 100, 100);
  const over = spent > budget.budget;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
        <button className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100" onClick={() => deleteBudget(budget.id)}>
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mb-3 text-sm font-semibold text-slate-800">
        Spent: {formatNPR(spent)} / Remaining:{' '}
        <span style={{ color: over ? '#ef4444' : 'inherit' }}>
          {formatNPR(Math.abs(remaining))}{over ? ' (over!)' : ''}
        </span>
      </div>

      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: over ? '#ef4444' : pct > 75 ? '#f59e0b' : budget.color,
          }}
        />
      </div>

      <div className="flex justify-between gap-2 text-xs text-slate-500">
        <span>{Math.round(pct)}% of budget</span>
        <span>{formatNPR(Math.max(remaining, 0))} left</span>
      </div>
    </div>
  );
};

const Budgets = () => {
  const { budgets } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="m-0 text-xl font-bold tracking-tight text-slate-900">Budget Categories</h2>
        <button className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets.map(b => <BudgetCard key={b.id} budget={b} />)}
      </div>

      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Budgets;
