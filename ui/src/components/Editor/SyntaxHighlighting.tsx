import React, { forwardRef } from 'react'
import { Token } from '../../../../lib'
import { TokenType } from '../../../../lib/lanex/lexer/Token'

const SyntaxHighlighting = forwardRef<HTMLDivElement, { tokens: Array<Token>, cursor: [number, number] }>(({ tokens, cursor }, ref) => {

    let isArgument = false
    let isComment = false
    let cursorPlaced = false

    return (
        <div ref={ ref } className='w-[calc(100%-5rem)] whitespace-pre syntax-highlighting'>
            { tokens.map((token) => {

                if(token.type === TokenType.ARGUMENT_START) isArgument = true
                if(token.type === TokenType.COMMENT) isComment = true

                let className = `token token-${ token.type.toLowerCase() }`

                if(isArgument) className += ' token-argument'
                if(isComment) className += ' token-comment'

                if(token.type === TokenType.ARGUMENT_END) isArgument = false
                if(token.type === TokenType.NEWLINE) isComment = false

                let isCursorInToken = token.range.start <= cursor[1] && token.range.end >= cursor[1]

                let tokenBeforeCursor = token.value
                let tokenAfterCursor = ''

                if(isCursorInToken && !cursorPlaced) {
                    tokenBeforeCursor = token.value.substring(0, cursor[1] - token.range.start)
                    tokenAfterCursor = token.value.substring(cursor[1] - token.range.start)

                    cursorPlaced = true
                }

                return (
                    <span data-range-from={ token.range.start } data-range-to={ token.range.end } key={ `${ token.range.start }-${ token.range.end }` } className={ className }>
                        { tokenBeforeCursor }
                        { isCursorInToken && <span data-token-value={ token.value } data-token-type={ token.type.toLowerCase() } className='cursor-location'></span>}
                        { tokenAfterCursor }
                    </span>
                )
            }) }
            <div className="spacer h-96 bg-transparent w-20"></div>
        </div>
    )
})

export default SyntaxHighlighting