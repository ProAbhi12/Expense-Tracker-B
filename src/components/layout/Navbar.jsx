import React from "react";
import { Search, User, Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = ({ toggleSidebar }) => {
  const { dark, toggleTheme } = useTheme();

  return (
    <header
      className={`h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-200 ${
        dark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 mr-4 md:hidden rounded-lg transition-colors ${
            dark
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Menu size={22} />
        </button>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={dark ? "text-slate-400" : "text-gray-400"} size={18} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className={`pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 transition-colors ${
              dark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                : "bg-gray-50 border-gray-200 text-gray-800"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  dark
                    ? "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {dark ? "Light Mode" : "Dark Mode"}
              </button>
          <div className="hidden sm:block text-right">
            <p className={`text-sm font-semibold ${dark ? "text-slate-100" : "text-gray-800"}`}>Abhi</p>
            <p className="text-xs text-blue-600 font-medium">Team Lead</p>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-colors ${
              dark
                ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
