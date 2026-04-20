import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

const toNumber = value => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const sanitized = value.replace(/,/g, '').trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const initialBudgets = [
  { id: uuidv4(), category: 'Food', budget: 3000, color: '#ef4444' },
  { id: uuidv4(), category: 'Transportation', budget: 1500, color: '#3b82f6' },
  { id: uuidv4(), category: 'Housing', budget: 10000, color: '#f59e0b' },
  { id: uuidv4(), category: 'Entertainment', budget: 100, color: '#10b981' },
  { id: uuidv4(), category: 'Shopping', budget: 2000, color: '#8b5cf6' },
];

const initialTransactions = [
  { id: uuidv4(), category: 'Food', amount: "450" },
  { id: uuidv4(), category: 'Transportation', amount: "750" },
  { id: uuidv4(), category: 'Entertainment', amount: "1000" },
  { id: uuidv4(), category: 'Shopping', amount: "1400" },
];

export const AppProvider = ({ children }) => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [transactions] = useState(initialTransactions);

  const addBudget = useCallback(budget => {
    const normalizedCategory = budget.category.trim().toLowerCase();

    setBudgets(currentBudgets => {
      const existingBudget = currentBudgets.find(
        item => item.category.trim().toLowerCase() === normalizedCategory,
      );

      if (!existingBudget) {
        return [...currentBudgets, { ...budget, id: uuidv4() }];
      }

      return currentBudgets.map(item => (
        item.id === existingBudget.id ? { ...item, ...budget, id: item.id } : item
      ));
    });
  }, []);

  const deleteBudget = useCallback(budgetId => {
    setBudgets(currentBudgets => currentBudgets.filter(budget => budget.id !== budgetId));
  }, []);

  const getSpentByCategory = useCallback(category => {
    const normalizedCategory = category.trim().toLowerCase();
    return transactions
      .filter(transaction => transaction.category.trim().toLowerCase() === normalizedCategory)
      .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  }, [transactions]);

  const value = useMemo(() => ({
    budgets,
    transactions,
    addBudget,
    deleteBudget,
    getSpentByCategory,
  }), [budgets, transactions, addBudget, deleteBudget, getSpentByCategory]);

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