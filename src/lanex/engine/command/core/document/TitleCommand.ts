import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Scope } from "../../../scope";
import { Command } from "../../Command";

export class TitleCommand extends Command {
    public run(node: Node): NormalizedNode {
        AST.expectCommandNodeArgument(node, 0)
        AST.expectCommandNodeArgumentSize(node, 0, 1)

        let children = AST.getCommandNodeArgument(node, 0)
        
        let rootScope = this.getRootScope()

        if(!rootScope.variables.has('doc_info')) rootScope.variables.set('doc_info', {})
        let doc_info = rootScope.variables.get('doc_info')

        doc_info['title'] = children

        rootScope.variables.set('doc_info', doc_info)
        
        return NAST.createNode(
            NormalizedNodeType.EMPTY,
            {},
            [],
            node.range
        )
    }
}