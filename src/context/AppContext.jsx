import React, { createContext,useCallback, useContext, 
    useMemo, useState } from 'react';
import categoryData from '../dummyData/categoryData.json';
import transactionsData from '../dummyData/transactions.json';

const uuidv4 = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const AppContext = createContext(null);

const toNumber = value => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const sanitized = value.replace(/,/g, '').trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const initialBudgets = categoryData.initialBudgets.map((item) => ({
  ...item,
  id: uuidv4(),
}));

const initialTransactions = transactionsData
  .filter(item => String(item.type).toUpperCase() === 'EXPENSE')
  .map((item) => ({
    category: item.category,
    amount: item.amount,
    id: uuidv4(),
  }));

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