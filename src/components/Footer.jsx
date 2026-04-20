import React from 'react'

function Footer() {
  return (
    <>
    <div className='bg-blue-700 text-white'>
      <div className='flex items-center justify-center py-4 border-b border-yellow-300'>
        <h2 className='text-3xl text-center font-bold mt-8'>Expense Tracker</h2>
      </div>
      
    <p className=' vh-100 vw-100 text-white flex items-center justify-center text-center text-sm sticky bottom-0 py-3'>
      &copy; 2024 Expense Tracker. All rights reserved.
    </p>
    </div>
    </>
  )
}

export default Footer
