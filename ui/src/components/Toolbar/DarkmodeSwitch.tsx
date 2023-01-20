import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../context/appcontext'
const DarkmodeSwitch = () => {

    const appContext = useContext(AppContext)

    const onClick = () => {
        appContext.setDarkmode(!appContext.darkmode)
    }

    return (
        <div onClick={ onClick } className='flex flex-col h-5 overflow-hidden cursor-pointer'>
            <FontAwesomeIcon style={{ marginTop: `${ appContext.darkmode ? 0 : -100 }%` }} className='h-5 transition-all' icon={ faMoon } />
            <FontAwesomeIcon className='h-5' icon={ faSun } />
        </div>
    )
}

export default DarkmodeSwitch