import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Scope } from "../../../scope";
import { Command } from "../../Command";

export class TextBfCommand extends Command {
    public run(node: Node): NormalizedNode {
        AST.expectCommandNodeArgument(node, 0)
        AST.expectCommandNodeArgumentSize(node, 0, 1)

        let children = AST.getCommandNodeArgument(node, 0)

        return NAST.createNode(
            NormalizedNodeType.INLINE_GROUP,
            {
                style: 'bold'
            },
            this.pass(children),
            node.range
        )
    }
}