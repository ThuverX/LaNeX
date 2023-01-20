import { Node, NodeType } from "../ast/Node";
import { NormalizedNode } from './NormalizedNode'

export namespace NAST {
    export function createNode(type: NormalizedNode['type'], args: NormalizedNode['arguments'], children: NormalizedNode['children'], range: NormalizedNode['range'], text?: string): NormalizedNode {
        return {
            type,
            arguments: args,
            text,
            children,
            range
        }
    }

    export function getNodeHash(node: NormalizedNode): string {
        return `${ node.range.start }-${ node.range.end }`
    }
}