import { inspect } from "util"
import { AST } from "../ast/AST"
import { Node, NodeType } from "../ast/Node"
import { LanexError } from "../lanexError"
import { Lexer } from "../lexer/lexer"
import { Token } from "../lexer/Token"
import { NormalizedNode, NormalizedNodeType } from "../nast/NormalizedNode"
import { Renderer } from "../render/renderer"
import { CommandRegistery } from "./command/CommandRegistery"
import { EnvironmentRegistery } from "./environment/EnvironmentRegistery"
import { ScopeRegistery } from "./scope/ScopeRegistery"

export interface LaNeXEngineOptions {
}

export class LaNeXEngine<K> {

    private options: LaNeXEngineOptions = {

    }

    public renderer: Renderer<K>
    public commandRegistery: CommandRegistery = new CommandRegistery(this)
    public environmentRegistery: EnvironmentRegistery = new EnvironmentRegistery(this)
    public scopeRegistery: ScopeRegistery = new ScopeRegistery(this)

    public documentInfo: { title: string, author: string, date: string } = {
        title: '',
        author: '',
        date: ''
    }

    constructor(renderer: Renderer<K>, options: Partial<LaNeXEngineOptions> = {}) {
        this.options = { ...this.options, ...options }
        this.renderer = renderer
    }

    private lastOutput: K | undefined = undefined

    public render(input: string): {
        output: K,
        ast: Node,
        tokens: Array<Token>,
        error?: LanexError
    } {
        this.scopeRegistery.clearScopes()

        let tokens: Array<Token> = []
        let ast: Node = {} as Node
        let nast: NormalizedNode = {} as NormalizedNode
        let output: K = undefined as unknown as K
        let error: LanexError | undefined = undefined

        try {
            tokens = Lexer.analyse(input)
            ast = AST.buildTreeRoot(tokens)
            nast = this.normalizeRoot(ast)
            output = this.renderer.render(nast)
            this.lastOutput = output
        } catch(e) {
            error = e as LanexError
        }

        let doc_info = this.scopeRegistery.getVariable<Record<string, Array<Node>>>('doc_info')

        this.documentInfo.title = AST.nodesToString(doc_info?.title || []) || 'Unnamed document'
        this.documentInfo.author = AST.nodesToString(doc_info?.author || []) || 'Unknown author'
        this.documentInfo.date = AST.nodesToString(doc_info?.date || []) || 'Unknown date'

        return {
            output: output || this.lastOutput || undefined as unknown as K,
            ast: ast,
            tokens: tokens,
            error
        }
    }

    public getCommandSuggestions(name?: string): string[] {
        if(!name) return []
        let list = this.commandRegistery.getCommandList().filter(command => command.startsWith(name))
        if(list.length === 1 && list[0] === name) return []
        return list
    }

    public normalizeRoot(ast: Node): NormalizedNode {
        return {
            type: NormalizedNodeType.BODY,
            arguments: {},
            children: this.normalize(ast.children),
            range: ast.range
        }
    }

    public normalize(ast: Array<Node>): Array<NormalizedNode> {
        let nodes: Array<NormalizedNode> = []

        let idx = 0
        for(let node of ast) {
            if(node.type == NodeType.TEXT) {
                nodes.push({
                    type: NormalizedNodeType.TEXT,
                    text: node.arguments.text,
                    arguments: {},
                    children: [],
                    range: node.range
                })
            } else if(node.type == NodeType.COMMAND) {
                let command = this.commandRegistery.get(node.arguments.name)
                
                if(!command)
                    throw new LanexError(`Command "${ node.arguments.name }" does not exist.`, node)

                if(command.isSwitch) {
                    let children = AST.getNodesUntil(ast.slice(idx + 1), 
                        (node) => node.type == NodeType.NEWLINE)
                    command.pushSwitchChildren(children)

                    ast.splice(idx + 1, children.length)
                }
                
                nodes.push(command.run(node))
            } else if(node.type == NodeType.ENVIRONMENT) {
                let command = this.environmentRegistery.get(node.arguments.name)
                
                if(!command)
                    throw new LanexError(`Environment "${ node.arguments.name }" does not exist.`, node)

                nodes.push(command.run(node))
            } else if(node.type == NodeType.MATH) {
                nodes.push({
                    type: NormalizedNodeType.MATH,
                    text: node.arguments.text,
                    arguments: {},
                    children: [],
                    range: node.range
                })
            }

            idx++
        }

        return nodes
    }
}