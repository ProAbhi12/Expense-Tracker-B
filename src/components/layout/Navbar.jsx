import React from "react";
import { Search, User, Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 md:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={22} />
        </button>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-400" size={18} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">Abhi</p>
            <p className="text-xs text-blue-600 font-medium">Team Lead</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
