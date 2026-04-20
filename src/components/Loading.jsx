import React from 'react'

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <svg className="animate-[spin_0.75s_linear_infinite] h-16 w-16 text-dark" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="50 50" stroke-linecap="round" />
      </svg>
      <p className="mt-4 text-2xl text-gray-500 font-bold">Loading <span className='animate-pulse  text-5xl'>...</span></p>
    </div>
  )
}

export default Loading
