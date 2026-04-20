import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
  const [form, setForm] = useState({ category: '', budget: '', icon: '💰', color: '#3b82f6' });

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="mb-5 text-xl font-bold text-slate-900">Add Budget Category</h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-600">Category Name</label>
          <input
            name="category"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            value={form.category}
            onChange={set}
            placeholder="e.g. Groceries"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="mb-4 sm:mb-0">
            <label className="mb-2 block text-sm font-medium text-slate-600">Budget Amount ($)</label>
            <input
              name="budget"
              type="number"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={form.budget}
              onChange={set}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Icon (emoji)</label>
            <input
              name="icon"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              value={form.icon}
              onChange={set}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-600">Color</label>
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
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50" onClick={onClose}>Cancel</button>
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
  const spent = getSpentByCategory(budget.category);
  const remaining = budget.budget - spent;
  const pct = Math.min((spent / budget.budget) * 100, 100);
  const over = spent > budget.budget;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: `${budget.color}22` }}>{budget.icon}</div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{budget.category}</h3>
          <p className="text-xs text-slate-500">Budget: ${budget.budget.toFixed(2)}</p>
        </div>
        <button className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100" onClick={() => deleteBudget(budget.id)}>
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mb-3 text-sm font-semibold text-slate-800">
        Spent: ${spent.toFixed(2)} / Remaining:{' '}
        <span style={{ color: over ? '#ef4444' : 'inherit' }}>
          ${Math.abs(remaining).toFixed(2)}{over ? ' (over!)' : ''}
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
        <span>${Math.max(remaining, 0).toFixed(2)} left</span>
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
