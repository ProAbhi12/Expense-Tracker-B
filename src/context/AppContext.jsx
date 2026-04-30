import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

const AppContext = createContext(null);

const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};

// THE 8 MASTER DEFAULT CATEGORIES
const initialBudgets = [
  {
    id: 1,
    name: "Salary",
    budget: 50000,
    color: "#22c55e",
    type: "INCOME",
    isDefault: true,
  },
  {
    id: 2,
    name: "Food",
    budget: 5000,
    color: "#ef4444",
    type: "EXPENSE",
    isDefault: true,
  },
  {
    id: 3,
    name: "Rent",
    budget: 15000,
    color: "#3b82f6",
    type: "EXPENSE",
    isDefault: true,
  },
  {
    id: 4,
    name: "Utilities",
    budget: 2000,
    color: "#06b6d4",
    type: "EXPENSE",
    isDefault: true,
  },
  {
    id: 5,
    name: "Transport",
    budget: 3000,
    color: "#f59e0b",
    type: "EXPENSE",
    isDefault: true,
  },
  {
    id: 6,
    name: "Shopping",
    budget: 4000,
    color: "#8b5cf6",
    type: "EXPENSE",
    isDefault: true,
  },
  {
    id: 7,
    name: "Entertainment",
    budget: 2000,
    color: "#ec4899",
    type: "EXPENSE",
    isDefault: true,
  },
  {
    id: 8,
    name: "Health",
    budget: 1000,
    color: "#10b981",
    type: "EXPENSE",
    isDefault: true,
  },
];

export const AppProvider = ({ children }) => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [transactions, setTransactions] = useState([]);

  // Fetch real transactions on load to keep categories updated
  useEffect(() => {
    fetch("https://localhost:7197/api/Transactions/alltransactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Context fetch error:", err));
  }, []);

  const addBudget = useCallback((budgetData) => {
    setBudgets((prev) => {
      if (budgetData.id) {
        return prev.map((b) =>
          b.id === budgetData.id ? { ...b, ...budgetData } : b,
        );
      }
      return [...prev, { ...budgetData, id: Date.now(), isDefault: false }];
    });
  }, []);

  const deleteBudget = useCallback((budgetId) => {
    setBudgets((current) => current.filter((b) => b.id !== budgetId));
  }, []);

  const getSpentByCategory = useCallback(
    (categoryName) => {
      if (!categoryName) return 0;
      const target = categoryName.trim().toLowerCase();

      // Calculate ONLY for Expenses (Logic fix)
      return transactions
        .filter(
          (t) =>
            t.type === "EXPENSE" &&
            (t.categoryName || "").trim().toLowerCase() === target,
        )
        .reduce((sum, t) => sum + toNumber(t.amount.toString()), 0);
    },
    [transactions],
  );

  const contextValue = useMemo(
    () => ({
      budgets,
      transactions,
      addBudget,
      deleteBudget,
      getSpentByCategory,
      setTransactions,
    }),
    [budgets, transactions, addBudget, deleteBudget, getSpentByCategory],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("❌ useApp must be used inside <AppProvider>");
  return context;
};
