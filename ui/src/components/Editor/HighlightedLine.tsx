import React from 'react'
import { Token } from '../../../../lib'

const HighlightedLine = ({ tokens, cursor }: { tokens: Array<Token>, cursor: [number, number] }) => {

    let lineNumber = 0

    for(let token of tokens) {
        if(token.range.start <= cursor[0] && token.range.end >= cursor[1]) {
            lineNumber = token.range.line
            break
        }
    }

    if(cursor[0] !== cursor[1]) {
        return <></>
    }

    return (
        <div
            className='absolute rounded-sm ml-[5rem] w-[2000vw] bg-dark-400 -z-[1] left-0 transition-all duration-75 ease-in-out'
            style={{ top: `${ lineNumber * 1.25 }rem`, height: `1.25rem` }}></div>
    )
}

export default HighlightedLine