import { Node } from "../../ast/Node"
import { NormalizedNode } from "../../nast/NormalizedNode"
import { LaNeXEngine } from "../lanexEngine"
import { Scope } from "../scope"

export class Environment {
    private parent: LaNeXEngine<any>

    constructor(parent: LaNeXEngine<any>) {
        this.parent = parent
    }

    public run(node: Node): NormalizedNode { throw new Error('Not implemented') }

    /**
     * Passes the provided nodes through the normalization process of the parent engine.
     * @param {Array<Node>} node - An array of nodes to be normalized.
     * @returns {Array<NormalizedNode>} The normalized version of the provided nodes.
     */
    public pass(node: Array<Node>): Array<NormalizedNode> {
        return this.parent.normalize(node)
    }

    /**
     * Gets the root scope of the parent engine.
     * @returns {Scope} The root scope.
     */
    public getRootScope(): Scope {
        return this.parent.scopeRegistery.getRootScope()
    }

    /**
     * Gets the current scope of the parent engine.
     * @returns {Scope} The current scope.
     */
    public getScope(): Scope {
        return this.parent.scopeRegistery.getScope()
    }
}