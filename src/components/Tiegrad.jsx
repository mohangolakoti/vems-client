import React from 'react'
import { tiegrad } from '../constants'

const Tiegrad = () => {
  return (
    <div className='flex justify-center items-center bg-gray-950'>
      <img src={tiegrad} alt="" className='w-10/12 h-screen' />
    </div>
  )
}

export default Tiegrad