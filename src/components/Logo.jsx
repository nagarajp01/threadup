import React from 'react'

function Logo({width="32px"}) {
  return (
    <div className='Logo'>
      <img src="/logo2.jpeg" alt="logo" className='logoImg' style={{width}} />
      <span className='logoText'>ThreadUp</span>
    </div>
  )
}

export default Logo