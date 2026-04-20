import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route
          path="categories"
          element={
            <div className="p-8 text-center text-gray-500 italic">
              Categories UI{" "}
            </div>
          }
        />
        <Route path="reports" element={<Reports />} />
        <Route
          path="settings"
          element={
            <div className="p-8 text-center text-gray-500 italic">
              Settings UI{" "}
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
