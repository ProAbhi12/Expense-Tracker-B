import React from 'react'
import { useTheme } from "../ThemeContext";

function Footer() {
  const { dark } = useTheme();

  return (
    <>
    <div className={`${dark ? "bg-slate-900 text-slate-100 border-slate-700" : "bg-blue-700 text-white border-yellow-300"}`}>
      <div className='flex items-center justify-center py-4 border-b'>
        <h2 className='text-3xl text-center font-bold mt-8'>Expense Tracker</h2>
      </div>
      
    <p className={`vh-100 vw-100 flex items-center justify-center text-center text-sm sticky bottom-0 py-3 ${dark ? "text-slate-300" : "text-white"}`}>
      &copy; 2024 Expense Tracker. All rights reserved.
    </p>
    </div>
    </>
  )
}

export default Footer
