import React, { createContext, useContext, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

const initialBudgets = [
  { id: uuidv4(), category: 'Food', budget: 300, icon: '🍔', color: '#ef4444' },
  { id: uuidv4(), category: 'Transportation', budget: 150, icon: '🚗', color: '#3b82f6' },
  { id: uuidv4(), category: 'Housing', budget: 1000, icon: '🏠', color: '#f59e0b' },
  { id: uuidv4(), category: 'Entertainment', budget: 100, icon: '🎬', color: '#10b981' },
  { id: uuidv4(), category: 'Shopping', budget: 200, icon: '🛍️', color: '#8b5cf6' },
];

const initialTransactions = [
  { id: uuidv4(), category: 'Food', amount: 86.75 },
  { id: uuidv4(), category: 'Transportation', amount: 42.5 },
  { id: uuidv4(), category: 'Entertainment', amount: 58 },
  { id: uuidv4(), category: 'Shopping', amount: 24.99 },
];

export const AppProvider = ({ children }) => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [transactions] = useState(initialTransactions);

  const addBudget = budget => {
    setBudgets(currentBudgets => [
      ...currentBudgets,
      { ...budget, id: uuidv4() },
    ]);
  };

  const deleteBudget = budgetId => {
    setBudgets(currentBudgets => currentBudgets.filter(budget => budget.id !== budgetId));
  };

  const getSpentByCategory = category => {
    return transactions
      .filter(transaction => transaction.category === category)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const value = useMemo(() => ({
    budgets,
    transactions,
    addBudget,
    deleteBudget,
    getSpentByCategory,
  }), [budgets, transactions]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);

  if (!ctx) throw new Error('useApp must be inside AppProvider');

  return ctx;
};