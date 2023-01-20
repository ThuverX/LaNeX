import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Environment } from "../../Environment";

export class DocumentEnvironment extends Environment {
    public run(node: Node): NormalizedNode {
        return NAST.createNode(
            NormalizedNodeType.GROUP,
            {},
            this.pass(node.children),
            node.range
        )
    }
}