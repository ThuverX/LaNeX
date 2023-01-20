import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Command } from "../../Command";

export class SectionCommand extends Command {
    public run(node: Node): NormalizedNode {
        AST.expectCommandNodeArgument(node, 0)
        AST.expectCommandNodeArgumentSize(node, 0, 1)

        let argumentNodes = AST.getCommandNodeArgument(node, 0)

        let scope = this.getRootScope()
        let section = scope.variables.get('section_num') || 0

        let sectionText = `${ section + 1 }. `

        scope.variables.set('section_num', section + 1)

        return NAST.createNode(
            NormalizedNodeType.HEADING1, 
            {}, 
            [
                NAST.createNode(
                    NormalizedNodeType.TEXT,
                    {},
                    [],
                    {
                        start: node.range.start,
                        end: node.range.start,
                        line: node.range.line,
                    },
                    sectionText
                ),
                ...this.pass(argumentNodes)
            ],
            node.range)
    }
}