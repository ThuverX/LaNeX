import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Command } from "../../Command";

export class UsepackageCommand extends Command {
    public run(node: Node): NormalizedNode {
        return NAST.createNode(
            NormalizedNodeType.EMPTY,
            {},
            [],
            node.range
        )
    }
}