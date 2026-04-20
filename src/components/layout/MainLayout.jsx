import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from "../../context/ThemeContext";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
   const { dark } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden font-sans antialiased transition-colors duration-200 ${
        dark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col overflow-hidden relative transition-colors duration-200 ${
          dark ? "bg-slate-900 text-slate-100" : "bg-slate-50/50 text-slate-900"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10 lg:p-12">
          <div className="mx-auto max-w-7xl">
            {/* This is where the specific page content will be rendered */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
