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
  UserCircle2,
  Repeat2,
  BellRing,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = ({ isOpen, toggleSidebar, openProfileModal }) => {
  const location = useLocation();
  const { dark, gradient } = useTheme();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Recurring", path: "/recurring", icon: Repeat2 },
    { name: "Bill Reminder", path: "/bill-reminder", icon: BellRing },
    { name: "Reports", path: "/reports", icon: PieChart },
    { name: "Profile", icon: UserCircle2, action: "profile" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-all duration-300 ease-in-out ${
        gradient
          ? "bg-gradient-to-b from-[#2d1b4e] to-[#1a0f3f] border-purple-700/40"
          : dark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      } ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div
        className={`flex items-center justify-between h-16 px-6 border-b ${
          gradient
            ? "border-purple-700/40"
            : dark
            ? "border-slate-700"
            : "border-gray-100"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <TrendingUp className="text-white" size={18} />
          </div>
          <span className={`text-lg font-bold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>
            ExpenseTracker
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className={`md:hidden ${gradient ? "text-purple-200" : dark ? "text-slate-300" : "text-gray-500"}`}
        >
          <Menu size={24} />
        </button>
      </div>

      <nav className="mt-4 px-3 space-y-1">
        {menuItems.map((item , index) => {
          const isProfileAction = item.action === "profile";
          const isActive = !isProfileAction && location.pathname === item.path;

          if (isProfileAction) {
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  openProfileModal();
                  toggleSidebar();
                }}
                className={`w-full text-left flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  gradient
                    ? "text-purple-200 hover:bg-purple-600/30 hover:text-purple-100"
                    : dark
                    ? "text-slate-300 hover:bg-slate-800 hover:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <item.icon className="mr-3" size={18} />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${
                isActive
                  ? gradient
                    ? "bg-purple-500/30 text-purple-200 font-semibold"
                    : dark
                    ? "bg-blue-500/15 text-blue-400 font-semibold"
                    : "bg-blue-50 text-blue-600 font-semibold"
                  : gradient
                    ? "text-purple-200 hover:bg-purple-600/30 hover:text-purple-100"
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
          gradient
            ? "border-purple-700/40"
            : dark
            ? "border-slate-700"
            : "border-gray-100"
        }`}
      >
        <Link
          to="/settings"
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            gradient
              ? "text-purple-200 hover:bg-purple-600/30 hover:text-purple-100"
              : dark
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
