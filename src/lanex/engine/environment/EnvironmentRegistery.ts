import { LaNeXEngine } from "../lanexEngine"
import { DocumentEnvironment } from "./core/document/DocumentEnvironment"
import { EnumerateEnvironment } from "./core/list/EnumerateEnvironment"
import { Environment } from "./Environment"

export class EnvironmentRegistery {
    private environments: Map<string, Environment> = new Map()

    private parent: LaNeXEngine<any>

    constructor(parent: LaNeXEngine<any>) {
        this.parent = parent

        this.registerEnvironment('document', DocumentEnvironment)
        
        this.registerEnvironment('enumerate', EnumerateEnvironment)
    }

    public registerEnvironment(name: string, environment: typeof Environment) {
        this.environments.set(name, new (environment as any)(this.parent))
    }

    public get(name: string): Environment | undefined {
        return this.environments.get(name)
    }
}