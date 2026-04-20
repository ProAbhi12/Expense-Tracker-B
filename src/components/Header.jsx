import React from 'react'
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className='px-[2rem] py-5 display flex items-center justify-between'>
    <div>
        <p className='hover:text-blue-500 text-3xl font-bold text-blue-600 cursor-pointer'>
          <i className="fa-sharp fa-solid fa-chart-line"></i> Income and Expenses Tracker
        </p>
      <small className={dark ? 'text-slate-400' : 'text-gray-500'}>Take Control Of Your Finance.</small>
    </div>

      <button
        onClick={toggleTheme}
        className='bg-blue-500 px-4 py-2 rounded-full text-yellow-300 hover:bg-blue-700 transition-colors duration-300 cursor-pointer'
      >
        <i className={`fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`}></i>
      </button>
    

    </div>
  ) 
}

export default Header
