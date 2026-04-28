import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Category";
import Reports from "./pages/Reports";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";

function SettingsPlaceholder() {
  const { dark } = useTheme();

  return (
    <div
      className={`p-8 text-center italic ${dark ? "text-slate-400" : "text-gray-500"}`}
    >
      Settings UI
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Budgets />} />
          <Route path="reports" element={<Reports />} />
          {/* <Route
          path="settings"
          element={<SettingsPlaceholder />}
        /> */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
