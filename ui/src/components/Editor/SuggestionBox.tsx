import React, { useContext, useEffect, useState } from 'react'
import { LanexContext } from '../../lanex/Context/LanexContext'

import { faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SuggestionBox = ({ syntaxRef, cursor }: { syntaxRef: React.RefObject<HTMLDivElement>, cursor: [number, number] }) => {

    const context = useContext(LanexContext)

    let [ cursorElementPosition, setCursorElementPosition ] = useState<DOMRect | undefined>(undefined)
    let [ tokenType, setTokenType ] = useState<string | undefined>(undefined)
    let [ tokenValue, setTokenValue ] = useState<string | undefined>(undefined)

    useEffect(() => {
        let cursorElement = syntaxRef.current?.querySelector('.cursor-location')

        if(cursorElement) {
            setCursorElementPosition(cursorElement.getBoundingClientRect())
            setTokenType(cursorElement.getAttribute('data-token-type') || undefined)

            let tokenValue = cursorElement.getAttribute('data-token-value') || undefined

            setTokenValue(tokenValue === '\\' ? undefined : tokenValue)
        }
    }, [cursor])


    if(!cursorElementPosition) return <></>
    if(tokenType !== 'identifier' && tokenType !== 'command') return <></>

    let suggestions = context.engine.getCommandSuggestions(tokenValue?.toLowerCase())

    if(suggestions.length === 0) return <></>

    return (
        <div style={{
            top: `${cursorElementPosition?.top || 0}px`,
            left: `${(cursorElementPosition?.left || 0) + (cursorElementPosition?.width || 0)}px`,
        }} className='fixed top-0 left-0 bg-dark-900 p-1 rounded-sm border-[1px] border-dark-200 z-30 ml-1 mt-[1em]'>
            <ul>
                { suggestions.map((command, index) => (
                    <li key={ index } className={`px-2 py-1 flex gap-2`} >
                        <FontAwesomeIcon className='my-auto h-3' icon={ faTag }/>
                        <span className='my-auto'>{ command }</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SuggestionBox