import React from 'react'

function Header() {
  return (
    <div className='px-[2rem] py-5  display flex items-center justify-between '>
    <div>
        <p className='hover:text-blue-500 text-3xl font-bold text-blue-600 cursor-pointer'><i class="fa-sharp fa-solid fa-chart-line"></i>  Income and Expenses Tracker</p>
      <small className='text-gray-500'>Take Control Of Your Finance.</small>
    </div>

      <button className='bg-blue-500 px-4 py-2 rounded-full text-yellow-300 hover:bg-blue-700 transition-colors duration-300 cursor-pointer'><i class="fa-solid fa-moon"></i></button>
    

    </div>
  ) 
}

export default Header
