import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Command } from "../../Command";

export class ItemCommand extends Command {

    public isSwitch = true

    public run(node: Node): NormalizedNode {

        let children = this.getChildren()

        let key = node.arguments.options

        return NAST.createNode(
            NormalizedNodeType.LIST_ITEM,
            {
                'data-label': key
            },
            this.pass(children),
            node.range
        )
    }
}