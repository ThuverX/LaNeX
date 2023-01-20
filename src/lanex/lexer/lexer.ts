import { LanexError } from "../lanexError";
import { Token, TokenType } from "./Token";

export namespace Lexer {

    export const Lexicon: Record<string, TokenType> = {
        "%": TokenType.COMMENT,
        "\\": TokenType.COMMAND,
        "{": TokenType.ARGUMENT_START,
        "}": TokenType.ARGUMENT_END,
        "[": TokenType.OPTION_START,
        "]": TokenType.OPTION_END,
        "$": TokenType.MATH_SECTION,
        "\n": TokenType.NEWLINE
    }

    // TODO: allow escaping of special characters
    export function analyse(input: string): Array<Token> {
        let tokens: Array<Token> = []

        let line = 0
    
        let i = 0

        let isCommand = false

        while(i < input.length) {
            let initialI = i
            let char = input[i]
            let nextChar = input[i + 1]
            let tokenType = Lexicon[char]
            let nextTokenType = Lexicon[nextChar]

            if(tokenType) {

                if(tokenType === TokenType.COMMAND && nextTokenType === TokenType.COMMAND) {
                    tokens.push({
                        type: TokenType.COMMAND,
                        value: '\\',
                        range: {
                            start: i,
                            end: i + 1,
                            line
                        }
                    })

                    tokens.push({
                        type: TokenType.IDENTIFIER,
                        value: '\\',
                        range: {
                            start: i + 1,
                            end: i + 2,
                            line
                        }
                    })

                    i += 2

                    continue
                }

                isCommand = tokenType === TokenType.COMMAND

                if(tokenType === TokenType.NEWLINE) line++

                tokens.push({
                    type: tokenType,
                    value: char,
                    range: {
                        start: i,
                        end: i + 1,
                        line
                    }
                })
                i++
            } else {
                let start = i
                while(i < input.length && !Lexicon[input[i]] && (isCommand && input[i] !== ' ' || !isCommand)) {
                    i++
                }

                let value = input.substring(start, i)

                tokens.push({
                    type: isCommand ? TokenType.IDENTIFIER : TokenType.TEXT,
                    value,
                    range: {
                        start: start,
                        end: i,
                        line
                    }
                })

                isCommand = false
            }

            if(i === initialI) {
                throw new LanexError(`[Prevented deadlock] Unexpected character '${char}' at line ${line + 1}`, {
                    range: {
                        start: i,
                        end: i + 1,
                        line
                    }
                })
            }
        }

        tokens.push({ type: TokenType.NEWLINE, value: '\n', range: { start: i, end: i + 1, line } })

        return tokens
    }
}