export enum NodeType {
    ROOT = "ROOT",
    GROUP = "GROUP",
    TEXT = "TEXT",
    COMMAND = "COMMAND",
    ENVIRONMENT = "ENVIRONMENT",
    MATH = "MATH",
    NEWLINE = "NEWLINE",
}

export interface Node {
    type: NodeType,
    arguments: Record<string, any>,
    children: Array<Node>,
    range: {
        start: number,
        end: number,
        line: number
    }
}