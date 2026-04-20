import React from 'react'
import { useTheme } from '../context/ThemeContext';

function Loading() {
  const { dark } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <svg className={`animate-[spin_0.75s_linear_infinite] h-16 w-16 ${dark ? 'text-slate-200' : 'text-slate-800'}`} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="50 50" strokeLinecap="round" />
      </svg>
      <p className={`mt-4 text-2xl font-bold ${dark ? 'text-slate-300' : 'text-gray-500'}`}>Loading <span className='animate-pulse text-5xl'>...</span></p>
    </div>
  )
}

export default Loading
