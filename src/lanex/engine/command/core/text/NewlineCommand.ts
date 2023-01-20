import { AST } from "../../../../ast/AST";
import { Node } from "../../../../ast/Node";
import { NAST } from "../../../../nast/NAST";
import { NormalizedNode, NormalizedNodeType } from "../../../../nast/NormalizedNode";
import { Scope } from "../../../scope";
import { Command } from "../../Command";

export class NewLineCommand extends Command {
    public run(node: Node): NormalizedNode {
        return NAST.createNode(
            NormalizedNodeType.TEXT,
            {},
            [],
            node.range,
            '\n'
        )
    }
}