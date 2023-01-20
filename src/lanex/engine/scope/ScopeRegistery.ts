import { LaNeXEngine } from "../lanexEngine"
import { Scope } from "../scope"

export class ScopeRegistery {

    private scopes: Array<Scope> = [{ variables: new Map() }]
    private parent: LaNeXEngine<any>

    constructor(parent: LaNeXEngine<any>) {
        this.parent = parent
    }

    public pushScope() {
        this.scopes.push({ variables: new Map() })
    }

    public popScope() {
        this.scopes.pop()
    }

    public setVariable<T>(name: string, value: T) {
        this.scopes[this.scopes.length - 1].variables.set(name, value)
    }

    public getScope(): Scope {
        return this.scopes[this.scopes.length - 1]
    }

    public getRootScope(): Scope {
        return this.scopes[0]
    }

    public getVariable<T>(name: string): T | undefined {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].variables.has(name)) {
                return this.scopes[i].variables.get(name)
            }
        }

        return undefined
    }

    public clearScopes() {
        this.scopes = [{ variables: new Map() }]
    }
}