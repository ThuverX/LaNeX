import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Environment } from "../../Environment";

export class EnumerateEnvironment extends Environment {
    public run(node: Node): NormalizedNode {
        return NAST.createNode(
            NormalizedNodeType.LIST,
            {},
            this.pass(node.children),
            node.range
        )
    }
}