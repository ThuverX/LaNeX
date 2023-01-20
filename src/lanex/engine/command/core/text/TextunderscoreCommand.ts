import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Scope } from "../../../scope";
import { Command } from "../../Command";


// TODO: Check if is a switch
export class TextUnderscoreCommand extends Command {

    public isSwitch = true
    
    public run(node: Node): NormalizedNode {
        let children = this.getChildren()

        return NAST.createNode(
            NormalizedNodeType.INLINE_GROUP,
            {
                style: 'underscore'
            },
            this.pass(children),
            node.range
        )
    }
}