import { NormalizedNode, NormalizedNodeType } from "../../nast/NormalizedNode";
import { Renderer } from "../renderer";

export class HTMLStringRenderer extends Renderer<string> {
    public render(ast: NormalizedNode): string {

        let html = ``

        if(ast.type == NormalizedNodeType.TEXT && ast.text) return ast.text

        for(let node of ast.children) {
            switch(node.type) {
                case NormalizedNodeType.TEXT:
                    html += node.text
                    break
                case NormalizedNodeType.HEADING1:
                    html += `<h1>${ this.render(node) }</h1>`
                    break
                case NormalizedNodeType.HEADING2:
                    html += `<h2>${ this.render(node) }</h2>`
                    break
                case NormalizedNodeType.HEADING3:
                    html += `<h3>${ this.render(node) }</h3>`
                    break
                case NormalizedNodeType.CODE:
                    html += `<code>${ this.render(node) }</code>`
                    break
                case NormalizedNodeType.CODE_BLOCK:
                    html += `<pre><code>${ this.render(node) }</code></pre>`
                    break
                case NormalizedNodeType.MATH:
                    html += `<span class="math">${ this.render(node) }</span>`
                    break
                case NormalizedNodeType.MATH_BLOCK:
                    html += `<div class="math">${ this.render(node) }</div>`
                    break
                case NormalizedNodeType.GROUP:
                    html += `<div class="group">${ this.render(node) }</div>`
                    break
                case NormalizedNodeType.INLINE_GROUP:
                    html += `<span class="group">${ this.render(node) }</span>`
                    break
                case NormalizedNodeType.BODY:
                    html += this.render(node)
                    break
                case NormalizedNodeType.EMPTY:
                    break
            }
        }

        return html
    }
}