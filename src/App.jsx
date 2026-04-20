import React from "react";
import { Routes ,Router , Route } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <Router>
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
          <Route
            path="reports"
            element={
              <div className="p-8 text-center text-gray-500 italic">
                Reports UI{" "}
              </div>
            }
          />
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
    </Router>
  );
}

export default App;
