import React from "react";
import { Search, User, Menu, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = ({ toggleSidebar, openProfileModal }) => {
  const { dark, gradient, theme, setThemeMode } = useTheme();
  const themeModes = ["light", "dark", "gradient"];
  const activeThemeIndex = themeModes.indexOf(theme);

  return (
    <header
      className={`h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-200 ${
        gradient
          ? "bg-gradient-to-r from-[#2d1b4e] to-[#1a0f3f] border-purple-700/40"
          : dark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 mr-4 md:hidden rounded-lg transition-colors ${
            gradient
              ? "text-purple-200 hover:bg-purple-900/30"
              : dark
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Menu size={22} />
        </button>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={gradient ? "text-purple-300" : dark ? "text-slate-400" : "text-gray-400"} size={18} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className={`pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 transition-colors ${
              gradient
                ? "bg-purple-900/30 border-purple-700/50 text-white placeholder:text-purple-300"
                : dark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                : "bg-gray-50 border-gray-200 text-gray-800"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div
            className={`relative grid grid-cols-3 items-center p-0.5 rounded-full border h-9 w-28 ${
              gradient
                ? "bg-purple-900/30 border-purple-700/50"
                : dark
                ? "bg-slate-800 border-slate-700"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-7 rounded-full transition-transform duration-300 ease-out ${
                gradient
                  ? "bg-purple-600/90"
                  : dark
                  ? "bg-slate-700"
                  : "bg-white"
              }`}
              style={{
                width: "calc((100% - 4px) / 3)",
                transform: `translateX(${Math.max(0, activeThemeIndex) * 100}%)`,
              }}
            />

            <button
              type="button"
              aria-label="Set light theme"
              onClick={() => setThemeMode("light")}
              className={`relative z-10 flex items-center justify-center rounded-full h-8 ${
                theme === "light"
                  ? gradient
                    ? "text-white"
                    : dark
                    ? "text-slate-100"
                    : "text-gray-800"
                  : gradient
                  ? "text-purple-200"
                  : dark
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              <Sun size={14} />
            </button>

            <button
              type="button"
              aria-label="Set dark theme"
              onClick={() => setThemeMode("dark")}
              className={`relative z-10 flex items-center justify-center rounded-full h-8 ${
                theme === "dark"
                  ? gradient
                    ? "text-white"
                    : dark
                    ? "text-slate-100"
                    : "text-gray-800"
                  : gradient
                  ? "text-purple-200"
                  : dark
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              <Moon size={14} />
            </button>

            <button
              type="button"
              aria-label="Set gradient theme"
              onClick={() => setThemeMode("gradient")}
              className={`relative z-10 flex items-center justify-center rounded-full h-8 ${
                theme === "gradient"
                  ? gradient
                    ? "text-white"
                    : dark
                    ? "text-slate-100"
                    : "text-gray-800"
                  : gradient
                  ? "text-purple-200"
                  : dark
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              <Sparkles size={14} />
            </button>
          </div>

          <div className="hidden sm:block text-right">
            <p className={`text-sm font-semibold ${gradient ? "text-white" : dark ? "text-slate-100" : "text-gray-800"}`}>Abhi</p>
            <p className="text-xs text-blue-600 font-medium">Team Lead</p>
          </div>
          <button
            type="button"
            onClick={openProfileModal}
            className={`w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-colors ${
              gradient
                ? "bg-purple-600/30 text-purple-200 border-purple-500/50 hover:bg-purple-600/50"
                : dark
                ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
