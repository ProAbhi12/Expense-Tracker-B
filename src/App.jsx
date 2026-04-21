import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Category";
import Reports from "./pages/Reports";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";

const SettingsPlaceholder = () => (
  <div className="p-8 text-center text-gray-500 italic">
    Settings UI delegated to Team Lead
  </div>
);

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="categories" element={<Budgets />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<SettingsPlaceholder />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
