import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ErrorArea = ({ message, range }: { message?: string, range?: { start: number, end: number, line: number} }) => {
    if(!message) return <></>
    return (
        <div className='absolute left-0 bottom-0 w-full flex'>
            <div className='flex flex-grow p-5 m-2 rounded-sm bottom-0 text-white bg-red-500 z-50 animate-bottom-drawer'>
                <FontAwesomeIcon icon={ faTriangleExclamation } className="my-auto mr-4" /><span>{ range && `${ range.line + 1 }:` } { message }</span>
            </div>
        </div>
    )
}

export default ErrorArea