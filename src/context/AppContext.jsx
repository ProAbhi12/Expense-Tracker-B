import React, { createContext,useCallback, useContext, 
    useMemo, useState } from 'react';

// ========== CONTEXT SETUP ==========
const AppContext = createContext(null);

// ========== HELPER FUNCTIONS ==========
/**
 * Safely converts any value to a number
 * Handles: numbers, strings with commas (1,500), invalid values
 */
const toNumber = (value) => {
  // If already a number, validate it
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  // If not a string, return 0
  if (typeof value !== 'string') {
    return 0;
  }

  // Remove commas and parse
  const cleaned = value.replace(/,/g, '').trim();
  const num = Number(cleaned);

  return Number.isFinite(num) ? num : 0;
};

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

/**
 * Sample transactions for testing
 */
const initialTransactions = [
  { id: uuidv4(), category: 'Food', amount: "450" },
  { id: uuidv4(), category: 'Transportation', amount: "750" },
  { id: uuidv4(), category: 'Entertainment', amount: "1000" },
  { id: uuidv4(), category: 'Shopping', amount: "1400" },
];

// ========== APP PROVIDER COMPONENT ==========
export const AppProvider = ({ children }) => {
  // State management
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
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// ========== CUSTOM HOOK ==========
/**
 * Hook to access app context anywhere in the component tree
 * Throws error if used outside of AppProvider
 */
export const useApp = () => {
  const context = useContext(AppContext);

  // Safety check: ensure hook is used inside provider
  if (!context) {
    throw new Error('❌ useApp must be used inside <AppProvider>');
  }

  return context;
};