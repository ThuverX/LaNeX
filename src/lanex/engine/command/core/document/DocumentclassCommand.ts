import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Scope } from "../../../scope";
import { Command } from "../../Command";

export class DocumentclassCommand extends Command {
    public run(node: Node): NormalizedNode {
        AST.expectCommandNodeArgument(node, 0)
        AST.expectCommandNodeArgumentSize(node, 0, 1)

        let text = AST.getNodeText(AST.getCommandNodeArgument(node, 0)[0])

        let rootScope = this.getRootScope()

        rootScope.variables.set('documentclass', text)

        return NAST.createNode(
            NormalizedNodeType.EMPTY,
            {},
            [],
            node.range
        )
    }
}