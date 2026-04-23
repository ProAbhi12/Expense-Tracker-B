import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  PieChart,
  Tags,
  TrendingUp,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Reports", path: "/reports", icon: PieChart },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 ${
        dark 
          ? "bg-slate-900 border-slate-800" 
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="shrink-0 w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <TrendingUp className="text-white" size={18} />
          </div>
          <span className={`text-lg font-bold tracking-tight ${dark ? "text-slate-100" : "text-gray-800"}`}>
            ExpenseTracker
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : dark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <item.icon className={`mr-3 transition-colors ${isActive ? "text-white" : "group-hover:text-blue-500"}`} size={18} />
              <span className={`text-sm font-semibold`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings Link */}
      <div className={`absolute bottom-0 w-full p-4 border-t ${dark ? "border-slate-800" : "border-gray-100"}`}>
        <Link
          to="/settings"
          className={`flex items-center px-4 py-2 rounded-xl transition-all ${
            dark
              ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
          }`}
        >
          <Settings className="mr-3" size={18} />
          <span className="text-sm font-semibold">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
