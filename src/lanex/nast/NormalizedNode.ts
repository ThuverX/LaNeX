export enum NormalizedNodeType {
    BODY = "BODY",
    EMPTY = "EMPTY",
    TEXT = "TEXT",
    GROUP = "GROUP",
    INLINE_GROUP = "INLINE_GROUP",
    HEADING1 = "HEADING1",
    HEADING2 = "HEADING2",
    HEADING3 = "HEADING3",
    CODE = "CODE",
    CODE_BLOCK = "CODE_BLOCK",
    MATH = "MATH",
    MATH_BLOCK = "MATH_BLOCK",
    LIST = "LIST",
    LIST_ITEM = "LIST_ITEM"
}

export interface NormalizedNode {
    type: NormalizedNodeType,
    arguments: Record<string, any>,
    children: Array<NormalizedNode>,
    text?: string,
    range: {
        start: number,
        end: number,
        line: number
    }
}