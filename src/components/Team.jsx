import React from 'react'
import { team } from '../constants'

const Team = () => {
  return (
    <div className='flex justify-center items-center bg-black'>
      <img src={team} alt="" className='w-10/12 h-screen' />
    </div>
  )
}

export default Team