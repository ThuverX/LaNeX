import React from 'react'
import { Token } from '../../../../lib'
import { TokenType } from '../../../../lib/lanex/lexer/Token'

const LineNumbers =  ({ tokens }: { tokens: Array<Token> }) => {

    let amount = 0

    for(let token of tokens) {
        if(token.type == TokenType.NEWLINE) {
            amount++
        }
    }

    return (
        <div className='w-[5rem]'>
            { Array.from(Array(amount).keys()).map((i) => {
                return (
                    <div key={ i } className='h-[1.25rem] tabular-nums text-right leading-5 text-sm mr-4 opacity-40 font-bold'>{ i + 1 }</div>
                )
            }) }
        </div>
    )
}

export default LineNumbers