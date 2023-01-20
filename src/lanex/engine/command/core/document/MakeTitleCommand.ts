import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Scope } from "../../../scope";
import { Command } from "../../Command";

export class MakeTitleCommand extends Command {
    public run(node: Node): NormalizedNode {
        let rootScope = this.getRootScope()
        let doc_info = rootScope.variables.get('doc_info') || {}

        let title = doc_info['title'] || []
        let author = doc_info['author'] || []
        let date = doc_info['date'] || []
        
        return NAST.createNode(
            NormalizedNodeType.GROUP,
            {
                style: 'center'
            },
            [
                NAST.createNode(
                    NormalizedNodeType.HEADING1,
                    {},
                    this.pass(title),
                    AST.combineRange(title)),
                NAST.createNode(
                    NormalizedNodeType.HEADING3,
                    {},
                    this.pass(author),
                    AST.combineRange(author)),
                NAST.createNode(
                    NormalizedNodeType.HEADING3,
                    {},
                    this.pass(date),
                    AST.combineRange(date))

            ],
            node.range
        )
    }
}