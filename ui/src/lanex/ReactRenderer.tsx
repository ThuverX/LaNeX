import React from "react";
import { NormalizedNode, Renderer } from "../../../lib";
import { NAST } from "../../../lib/lanex/nast/NAST";
import { NormalizedNodeType } from "../../../lib/lanex/nast/NormalizedNode";
import { InlineMath, BlockMath } from 'react-katex';

export class ReactRenderer extends Renderer<JSX.Element> {

    public transformAttribute(attrs: Record<string, string>): Record<string, any> {
        let result: Record<string, any> = {}
        let style: Record<string, string> = {}

        for(let [ k,v ] of Object.entries(attrs)) {

            if(k == 'style') {
                result['className'] = v
            }

            result[k] = v
        }

        if(style)
            result['style'] = style

        return result
    }

    render(ast: NormalizedNode): JSX.Element {
        if(ast.type == NormalizedNodeType.EMPTY) return <></>
        if(ast.type == NormalizedNodeType.TEXT) return <>{ ast.text! }</>

        return (
            <>
                { ast.children.map(node => {

                    let atrs = this.transformAttribute(node.arguments)
                    let key = NAST.getNodeHash(node)
                    let rangeFrom = node.range?.start || 0
                    let rangeTo = node.range?.end || 0

                    switch(node.type) {
                        case NormalizedNodeType.GROUP:
                            return <div data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</div>
                        case NormalizedNodeType.INLINE_GROUP:
                            return <span data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</span>
                        case NormalizedNodeType.TEXT:
                            return <span data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key }>{ node.text }</span>
                        case NormalizedNodeType.HEADING1:
                            return <h1 data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</h1>
                        case NormalizedNodeType.HEADING2:
                            return <h2 data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</h2>
                        case NormalizedNodeType.HEADING3:
                            return <h3 data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</h3>
                        case NormalizedNodeType.LIST:
                            return <ul data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</ul>
                        case NormalizedNodeType.LIST_ITEM:
                            return <li data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</li>
                        case NormalizedNodeType.EMPTY:
                            break
                        case NormalizedNodeType.CODE_BLOCK:
                            return <pre data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }><code>{ this.render(node) }</code></pre>
                        case NormalizedNodeType.CODE:
                            return <code data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ this.render(node) }</code>
                        case NormalizedNodeType.MATH:
                            return <InlineMath data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ node.text || '' }</InlineMath>
                        case NormalizedNodeType.MATH_BLOCK:
                            return <BlockMath data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key } { ...atrs }>{ node.text || '' }</BlockMath>
                        case NormalizedNodeType.BODY:
                            return <React.Fragment data-range-from={ rangeFrom } data-range-to={ rangeTo } key={ key }>{ this.render(node) }</React.Fragment>
                    }

                    return
                }) }
            </>
        )
    }
}