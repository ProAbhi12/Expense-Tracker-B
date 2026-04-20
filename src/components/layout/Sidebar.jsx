import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  PieChart,
  Tags,
  Menu,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../../ThemeContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { dark } = useTheme();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Reports", path: "/reports", icon: PieChart },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-all duration-300 ease-in-out ${
        dark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
      } ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div
        className={`flex items-center justify-between h-16 px-6 border-b ${
          dark ? "border-slate-700" : "border-gray-100"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <TrendingUp className="text-white" size={18} />
          </div>
          <span className={`text-lg font-bold ${dark ? "text-slate-100" : "text-gray-800"}`}>
            ExpenseTracker
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className={`md:hidden ${dark ? "text-slate-300" : "text-gray-500"}`}
        >
          <Menu size={24} />
        </button>
      </div>

      <nav className="mt-4 px-3 space-y-1">
        {menuItems.map((item , index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? dark
                    ? "bg-blue-500/15 text-blue-400 font-semibold"
                    : "bg-blue-50 text-blue-600 font-semibold"
                  : dark
                    ? "text-slate-300 hover:bg-slate-800 hover:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <item.icon className="mr-3" size={18} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={`absolute bottom-0 w-full p-4 border-t ${
          dark ? "border-slate-700" : "border-gray-100"
        }`}
      >
        <Link
          to="/settings"
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            dark
              ? "text-slate-300 hover:bg-slate-800 hover:text-blue-400"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Settings className="mr-3" size={18} />
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
