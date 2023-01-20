import { LanexError } from "../lanexError";
import { Token, TokenType } from "../lexer/Token";
import { NormalizedNode } from "../nast/NormalizedNode";
import { Node, NodeType } from "./Node";

export namespace AST {

    function expectType(token: Token, type: TokenType) {
        if(token.type !== type)
            throw new LanexError(`Expected token of type ${type} but got ${token.type}`, token)
    }

    export function combineRange(tokens: Array<Token | Node | NormalizedNode>): { start: number, end: number, line: number } {
        let start = tokens[0].range.start
        let end = tokens[tokens.length - 1].range.end
        let line = tokens[0].range.line
        return { start, end, line }
    }

    export function getNodesUntil(nodes: Array<Node>, predicate: (node: Node) => boolean) {
        let i = 0
        for(let node of nodes) {
            if(predicate(node)) break
            i++
        }
        return nodes.slice(0, i)
    }

    export function createNode(type: NodeType, args: Record<string, any>, children: Array<Node>, range: { start: number, end: number, line: number }): Node {
        return {
            type,
            arguments: args,
            children,
            range
        }
    }

    export function buildTreeRoot(tokens: Array<Token>): Node {
        if(tokens.length === 0) return createNode(NodeType.ROOT, {}, [], { start: 0, end: 0, line: 0 })

        return createNode(
            NodeType.ROOT, {}, 
            buildTree(tokens).value, 
            combineRange(tokens))
    }
    
    export type ValueWithLength<T> = { value: T, length: number }

    export function valueWithLength<T>(value: T, length: number): ValueWithLength<T> {
        return { value, length }
    }

    export function tokensToString(tokens: Array<Token>): string {
        return tokens.map(token => token.value).join('')
    }

    export function nodesToString(nodes: Array<Node>): string {
        return nodes.map(node => {
            if(node.type === NodeType.TEXT) return node.arguments.text
            else if(node.type === NodeType.NEWLINE) return '\n'
            return ''
        }).join('')
    }

    export type ValueWithLengthAndResult<T, R> = { value: T, length: number, result: R }

    export function valueWithLengthAndResult<T, R>(value: T, length: number, result: R): ValueWithLengthAndResult<T, R> {
        return { value, length, result }
    }

    export function buildTree(tokens: Array<Token>, predicate?: (...nextTokens: Array<Token>) => boolean): ValueWithLengthAndResult<Array<Node>, boolean> {
        let nodes: Array<Node> = []
        let found = false

        let i = 0
        while(i < tokens.length) {
            
            let intialIndex = i
            let token = tokens[i]

            if(predicate && predicate(...tokens.slice(i))) {
                found = true
                break
            }

            if(token.type === TokenType.COMMENT) {
                let { length } = collectCommentNode(tokens.slice(i))
                i += length
            }

            if(token.type === TokenType.NEWLINE) {
                nodes.push(createNode(
                    NodeType.NEWLINE, {}, [], token.range))
                i++
            }

            if(token.type === TokenType.COMMAND) {
                let commandNode = collectCommandNode(tokens.slice(i))
                if(commandNode.value)
                    nodes.push(commandNode.value)
                i += commandNode.length
            }

            if(token.type === TokenType.TEXT) {
                let textNode = collectTextNode(tokens.slice(i))
                nodes.push(textNode.value)
                i += textNode.length
            }

            if(token.type === TokenType.MATH_SECTION) {
                let mathNode = collectMathSectionNode(tokens.slice(i))
                nodes.push(mathNode.value)
                i += mathNode.length
            }

            if(token.type === TokenType.OPTION_START || token.type === TokenType.OPTION_END) {
                nodes.push(createNode(
                    NodeType.TEXT, 
                    { text: tokens[i].value }, 
                    [],
                    tokens[i].range))
                i += 1
            }

            if(i === intialIndex)
                throw new LanexError(`Unexpected token ${token.type} at index ${i} [${i}/${tokens.length}]`, token)
        }

        return valueWithLengthAndResult(nodes, i, found)
    }

    export function collectTextNode(tokens: Array<Token>): ValueWithLength<Node> {

        expectType(tokens[0], TokenType.TEXT)

        let textNode = createNode(
            NodeType.TEXT, 
            { text: tokens[0].value.trimStart() }, 
            [],
            tokens[0].range)

        return valueWithLength(
            textNode,
            1
        )
    }

    export function collectCommandNode(tokens: Array<Token>): ValueWithLength<Node | null> {

        expectType(tokens[0], TokenType.COMMAND)
        expectType(tokens[1], TokenType.IDENTIFIER)

        
        let commandName = (tokens[1].value).toLowerCase()

        if(commandName.includes(' '))
            throw new LanexError(`Command name "${ commandName.trim() }" cannot contain spaces`, tokens[1]) 
            
        // Took 2 tokens for the command and the identifier
        let taken = 2

        let commandOptions = collectCommandOptions(tokens.slice(2))
        let commandArguments = collectCommandArguments(tokens.slice(2 + commandOptions.length))
        let totalLength = taken + commandArguments.length + commandOptions.length

        if(commandName === 'begin') {

            if(commandArguments.value.length < 1)
                throw new LanexError(`Expected at least one argument for environment name`, commandArguments.value[0])
            if(commandArguments.value[0].type !== NodeType.GROUP)
                throw new LanexError(`Expected environment name to be in a group`, commandArguments.value[0])
            if(commandArguments.value[0].children[0].type !== NodeType.TEXT)
                throw new LanexError(`Expected environment name to be of type text`, commandArguments.value[0])

            let envname = commandArguments.value[0].children[0].arguments.text
            let environmentNode = collectEnvironmentNode(
                tokens.slice(totalLength), 
                envname,
                {
                    name: envname,
                    arguments: commandArguments.value,
                    options: commandOptions.value
                })

            return valueWithLength(environmentNode.value, environmentNode.length + totalLength)
        } else if(commandName === 'end')
            return valueWithLength(null, totalLength)

        let commandNode = createNode(
            NodeType.COMMAND, 
            {
                name: commandName,
                arguments: commandArguments.value,
                options: commandOptions.value
            }, 
            [], combineRange(tokens.slice(0, totalLength)))

        return valueWithLength(
            commandNode,
            totalLength
        )
    }

    export function collectCommandArguments(tokens: Array<Token>): ValueWithLength<Array<Node>> {
        if(tokens.length === 0) return valueWithLength([], 0)
        if(tokens[0].type !== TokenType.ARGUMENT_START) return valueWithLength([], 0)

        let topLevelArgs = buildTree(
            tokens.slice(1), 
            (t) => t.type === TokenType.ARGUMENT_END)

        if(topLevelArgs.length !== 0) {

            if(topLevelArgs.length + 1 < tokens.length)
                expectType(tokens[topLevelArgs.length + 1], TokenType.ARGUMENT_END)
            else throw new LanexError(`Expected token of type ${TokenType.ARGUMENT_END} but got undefined`, tokens[0])
        }

        let nodes: Array<Node> = [
            {
                type: NodeType.GROUP,
                arguments: {},
                children: topLevelArgs.value,
                range: topLevelArgs.length > 0 ? combineRange(topLevelArgs.value) : tokens[0].range
            }
        ]

        let length = topLevelArgs.length

        if(tokens[length + 2] && tokens[length + 2].type === TokenType.ARGUMENT_START) {
            let { value: nextNodes, length: nextLength } = collectCommandArguments(tokens.slice(length + 2))
            nodes = [...nodes, ...nextNodes]
            length += nextLength
        }

        // Add 2 to length to account for the ARGUMENT_START and ARGUMENT_END tokens
        return valueWithLength(nodes, length + 2)
    }

    export function collectMathSectionNode(tokens: Array<Token>): ValueWithLength<Node> {
        expectType(tokens[0], TokenType.MATH_SECTION)
        
        let mathBody = buildTree(
            tokens.slice(1), 
            (t) => t.type === TokenType.MATH_SECTION)
            
        let bodyTokens = tokens.slice(1, mathBody.length + 1)

        if(bodyTokens.length === 0)
            throw new LanexError(`Expected math body but got undefined`, tokens[0])

        let mathSectionNode = createNode(
            NodeType.MATH, 
            { text: tokensToString(bodyTokens) }, 
            [],
            combineRange(bodyTokens))

        // Add 1 to length to account for the last MATH_SECTION token
        return valueWithLength(
            mathSectionNode,
            mathBody.length + 2
        )
    }

    export function collectCommandOptions(tokens: Array<Token>): ValueWithLength<string> {
        if(tokens.length === 0) return valueWithLength('', 0)
        if(tokens[0].type !== TokenType.OPTION_START) return valueWithLength('', 0)

        expectType(tokens[1], TokenType.TEXT)
        expectType(tokens[2], TokenType.OPTION_END)

        let opts = tokens[1].value

        return valueWithLength(opts, 3)
    }

    export function collectCommentNode(tokens: Array<Token>): ValueWithLength<null> {
        expectType(tokens[0], TokenType.COMMENT)
        
        let commentBody = buildTree(
            tokens.slice(1), 
            (t) => t.type === TokenType.NEWLINE)
            
        let bodyTokens = tokens.slice(1, commentBody.length + 1)

        // Add 2 to length to account for the COMMENT and NEWLINE tokens
        return valueWithLength(
            null,
            bodyTokens.length + 2
        )
    }

    export function collectEnvironmentNode(tokens: Array<Token>, envname: string, args: Record<string, any>): ValueWithLength<Node> {

        let depth = 1
        let environmentBody = buildTree(
            tokens.slice(1), 
            (cmd, idt, arg_str, arg_val) => {
                if(!cmd || !idt || !arg_str || !arg_val) return false

                if(cmd.type === TokenType.COMMAND &&
                    idt.type === TokenType.IDENTIFIER &&
                    idt.value === 'end' &&
                    arg_str.type === TokenType.ARGUMENT_START &&
                    arg_val.value === envname) {
                    depth--
                } else if(cmd.type === TokenType.COMMAND &&
                    idt.type === TokenType.IDENTIFIER &&
                    idt.value === 'begin' &&
                    arg_str.type === TokenType.ARGUMENT_START &&
                    arg_val.value === envname) {
                    depth++
                }

                return depth === 0
            })

        if(!environmentBody.result)
            throw new LanexError(`Expected end of environment "${ envname }" but got undefined`, tokens[0])

        return valueWithLength({
            type: NodeType.ENVIRONMENT,
            arguments: args,
            children: environmentBody.value,
            range: combineRange(tokens.slice(1, environmentBody.length + 1))
        }, environmentBody.length + 1)
    }

    export function traverseTree(node: Node, callback: (node: Node) => void) {
        callback(node)
        for(let child of node.children)
            traverseTree(child, callback)
    }

    export function expectKey(struct: Record<string, any>, key: string, value?: any): void {
        if(!struct[key]) throw new Error(`Expected key ${ key } to be present.`)
        if(value) {
            if(struct[key] !== value) throw new Error(`Expected key ${ key } to be ${ value }, got ${ struct[key] }.`)
        }
    }

    export function expectAtleastLength(array: Array<any>, length: number): void {
        if(array.length < length) throw new Error(`Expected array to have atleast ${ length } elements, got ${ array.length }.`)
    }

    export function expectNode(node: Node, type: Node['type']): void {
        if(node.type !== type) throw new LanexError(`Expected node to be of type ${ type }, got ${ node.type }.`, node)
    }

    export function expectCommandNodeArgument(node: Node, index: number): void {
        expectNode(node, NodeType.COMMAND)
        expectAtleastLength(node.arguments.arguments, index + 1)
        expectNode(node.arguments.arguments[index], NodeType.GROUP)
    }

    export function expectCommandNodeArgumentSize(node: Node, index: number, size: number): void {
        expectCommandNodeArgument(node, index)
        expectAtleastLength(node.arguments.arguments[index].children, size)
    }

    export function getCommandNodeArgument(node: Node, index: number): Array<Node> {
        expectNode(node, NodeType.COMMAND)
        expectAtleastLength(node.arguments.arguments, index + 1)
        expectNode(node.arguments.arguments[index], NodeType.GROUP)
        return node.arguments.arguments[index].children
    }

    export function getNodeText(node: Node): string {
        expectNode(node, NodeType.TEXT)
        return node.arguments.text
    }

    export function getNodeHash(node: Node): string {
        return `${ node.range.start }-${ node.range.end }`
    }
}