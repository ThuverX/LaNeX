import React from 'react'
import LaNeX from '../LaNeX'
import DarkmodeSwitch from './DarkmodeSwitch'

const Toolbar = () => {
    return (
        <div className='flex h-16 px-4 bg-dark-450 border-b-[1px] border-dark-400 font-display gap-4'>
            <div className='text-accent-primary font-black my-auto'><LaNeX/></div>
            <div className='ml-auto my-auto flex'>
                <DarkmodeSwitch/>
            </div>
        </div>
    )
}

export default Toolbar