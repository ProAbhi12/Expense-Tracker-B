import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, UtensilsCrossed, Car, Home, Film, 
  ShoppingCart, Lightbulb, Heart, BookOpen, Receipt
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

/**
 * Smart icon matching for custom categories - matches keywords
 */
const getSmartIconForCategory = (categoryName) => {
  const name = categoryName.toLowerCase().trim();
  const preset = CATEGORY_OPTIONS.find(item => item.category.toLowerCase() === name);
  if (preset) return { display: preset.icon, color: preset.color };

  if (['petrol', 'gas', 'car', 'bike', 'taxi'].some(k => name.includes(k))) return { display: <Car size={20}/>, color: '#3b82f6' };
  if (['food', 'grocery', 'eat', 'meal', 'restaurant'].some(k => name.includes(k))) return { display: <UtensilsCrossed size={20}/>, color: '#ef4444' };
  if (['electricity', 'bill', 'internet', 'wifi', 'phone'].some(k => name.includes(k))) return { display: <Lightbulb size={20}/>, color: '#06b6d4' };
  if (['movie', 'game', 'party', 'fun'].some(k => name.includes(k))) return { display: <Film size={20}/>, color: '#10b981' };
  if (['doctor', 'medicine', 'health', 'gym'].some(k => name.includes(k))) return { display: <Heart size={20}/>, color: '#ec4899' };
  if (['shopping', 'buy', 'clothes', 'mall'].some(k => name.includes(k))) return { display: <ShoppingCart size={20}/>, color: '#8b5cf6' };
  if (['rent', 'home', 'house', 'room'].some(k => name.includes(k))) return { display: <Home size={20}/>, color: '#f59e0b' };
  
  return { display: <Receipt size={20}/>, color: '#9ca3af' };
};

// ========== ADD BUDGET MODAL COMPONENT ==========
const AddBudgetModal = ({ onClose }) => {
  const { addBudget } = useApp();
  const { dark } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(CATEGORY_OPTIONS[0].category);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    category: CATEGORY_OPTIONS[0].category,
    budget: '',
    color: CATEGORY_OPTIONS[0].color,
  });

  const onPresetChange = e => {
    const categoryName = e.target.value;
    setSelectedPreset(categoryName);
    if (categoryName === 'custom') {
      setForm(p => ({ ...p, category: '', color: COLOR_SWATCHES[0] }));
    } else {
      const option = CATEGORY_OPTIONS.find(item => item.category === categoryName);
      setForm({ category: option.category, budget: form.budget, color: option.color });
    }
  };

  const onSubmit = () => {
    const budgetValue = parseAmountInput(form.budget);
    if (!form.category.trim()) return setError('Enter a name');
    if (!budgetValue || budgetValue <= 0) return setError('Enter a valid amount');
    addBudget({ category: form.category, budget: budgetValue, color: form.color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-in zoom-in duration-200 ${dark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white"}`} onClick={e => e.stopPropagation()}>
        <h2 className="mb-5 text-xl font-bold">Add Budget Category</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Select Category</label>
            <select value={selectedPreset} onChange={onPresetChange} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? "border-slate-700 bg-slate-800" : "border-slate-300"}`}>
              {CATEGORY_OPTIONS.map(item => <option key={item.category} value={item.category}>{item.icon} {item.category}</option>)}
              <option value="custom">Custom Category</option>
            </select>
          </div>
          {selectedPreset === 'custom' && (
            <div>
              <label className="mb-2 block text-sm font-medium">Custom Name</label>
              <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? "border-slate-700 bg-slate-800" : "border-slate-300"}`} placeholder="e.g. Groceries" />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium">Budget Amount (Rs.)</label>
            <input value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? "border-slate-700 bg-slate-800" : "border-slate-300"}`} placeholder="e.g. 1500" />
          </div>
          {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
          <div>
            <label className="mb-2 block text-sm font-medium">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map(c => <button key={c} onClick={() => setForm({...form, color: c})} className={`h-7 w-7 rounded-full border-2 ${form.color === c ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{ background: c }} />)}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500">Cancel</button>
          <button onClick={onSubmit} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
};

// ========== BUDGET CARD COMPONENT ==========
const BudgetCard = ({ budget }) => {
  const { getSpentByCategory, deleteBudget } = useApp();
  const { dark } = useTheme();
  const { display: icon, color } = getSmartIconForCategory(budget.category);
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
        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" onClick={() => deleteBudget(budget.id)}><Trash2 size={16} /></button>
      </div>
      <div className={`mb-4 h-2 w-full rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <div className="h-full transition-all duration-500" style={{ width: `${percentage}%`, background: isOver ? '#ef4444' : color }} />
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
  
  const chartData = budgets.map(item => ({ name: item.category, value: item.budget, color: item.color }));
  const trendData = budgets.map(item => ({ label: item.category, value: item.budget * trendMultipliers[trendRange] }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>Budget Categories</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
          <Plus size={18} /> Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets.map(budget => <BudgetCard key={budget.id} budget={budget} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className={`rounded-2xl border p-6 ${dark ? "border-slate-700 bg-slate-900 shadow-lg" : "border-slate-200 bg-white shadow-sm"}`}>
          <h3 className="font-bold mb-4">Distribution</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
        </div>
        <div className={`rounded-2xl border p-6 ${dark ? "border-slate-700 bg-slate-900 shadow-lg" : "border-slate-200 bg-white shadow-sm"}`}>
          <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Trend</h3><div className="flex gap-1">{['daily', 'weekly', 'monthly', 'yearly'].map(r => <button key={r} onClick={() => setTrendRange(r)} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${trendRange === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{r}</button>)}</div></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? "#334155" : "#e2e8f0"} /><XAxis dataKey="label" stroke={dark ? "#94a3b8" : "#64748b"} tick={{fontSize: 10}} /><YAxis stroke={dark ? "#94a3b8" : "#64748b"} tick={{fontSize: 10}} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div>
        </div>
      </div>
      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Budgets;
