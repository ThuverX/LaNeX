export enum TokenType {
    TEXT = "TEXT",
    COMMAND = "COMMAND",
    IDENTIFIER = "IDENTIFIER",
    ARGUMENT_START = "ARGUMENT_START",
    ARGUMENT_END = "ARGUMENT_END",
    OPTION_START = "OPTION_START",
    OPTION_END = "OPTION_END",
    MATH_SECTION = "MATH_SECTION",
    COMMENT = "COMMENT",
    NEWLINE = "NEWLINE"
}

export interface Token {
    type: TokenType,
    value: string,
    range: {
        start: number,
        end: number,
        line: number
    }
}