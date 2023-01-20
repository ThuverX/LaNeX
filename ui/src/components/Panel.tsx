import React from 'react'

const Panel = ({ children, className }: { children: JSX.Element | JSX.Element[], className?: string }) => {
    return (
        <div className={`flex flex-col flex-grow w-1/2 ${ className }`}>{ children }</div>
    )
}

export default Panel