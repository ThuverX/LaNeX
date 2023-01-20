import { useContext, useEffect, useRef, useState } from "react"
import { LanexContext } from "../../lanex/Context/LanexContext"
import Panel from "../Panel"
import ErrorArea from "./ErrorArea"
import HighlightedLine from "./HighlightedLine"
import LineNumbers from "./LineNumbers"
import SuggestionBox from "./SuggestionBox"
import SyntaxHighlighting from "./SyntaxHighlighting"

const EditorWindow = () => {

    const context = useContext(LanexContext)

    const [ cursor, setCursor ] = useState<[number, number]>([0, 0])
    const [ isMouseDown, setIsMouseDown ] = useState<boolean>(false)

    const documentRef = useRef<HTMLDivElement>(null)
    const syntaxRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        context.setContent(evt.target.value)

        setCursor([evt.target.selectionStart, evt.target.selectionEnd])
        syncScroll()
    }

    const onKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ( evt.target instanceof HTMLTextAreaElement ) {
            setCursor([evt.target.selectionStart, evt.target.selectionEnd])
            syncScroll()
        }
    }
    
    const onClick = (evt: React.MouseEvent<HTMLTextAreaElement>) => {
        if ( evt.target instanceof HTMLTextAreaElement ) {
            setCursor([evt.target.selectionStart, evt.target.selectionEnd])
            syncScroll()
            syncToken()
        }
    }

    const onSelect = (evt: React.SyntheticEvent<HTMLTextAreaElement>) => {
        if ( evt.target instanceof HTMLTextAreaElement ) {
            setCursor([evt.target.selectionStart, evt.target.selectionEnd])
            syncScroll()
            syncToken()
        }
    }

    const onMouseMove = (evt: React.MouseEvent<HTMLTextAreaElement>) => {
        if ( evt.target instanceof HTMLTextAreaElement ) {
            if ( isMouseDown ) {
                setCursor([evt.target.selectionStart, evt.target.selectionEnd])
            }
        }
    }

    const syncScroll = () => {
        if ( editorRef.current && inputRef.current ) {
            editorRef.current.scrollTop = inputRef.current.scrollTop
            editorRef.current.scrollLeft = inputRef.current.scrollLeft
        }
    }

    const syncToken = () => {

        for(let token of context.result.tokens) {
            if(token.range.start <= cursor[0] && token.range.end >= cursor[1]) {
                context.sync.setCurrentToken(token.range.start)
                break
            }
        }
    }

    const onScroll = (evt: React.UIEvent<HTMLTextAreaElement>) => {
        syncScroll()
    }

    return (
        <Panel className="relative overflow-hidden border-r-[1px] border-r-dark-400">
            <div className="relative flex flex-grow leading-5 pt-2 pr-2 mb-[5rem] font-code overflow-hidden">
                <textarea
                    value={ context.content }
                    ref={ inputRef }
                    onChange={ onChange }
                    onKeyDown={ onKeyDown }
                    onKeyUp={ onKeyDown }
                    onClick={ onClick }
                    onMouseDown={ () => setIsMouseDown(true) }
                    onMouseUp={ () => setIsMouseDown(false) }
                    onMouseMove={ onMouseMove }
                    onSelect={ onSelect }
                    onScroll={ onScroll }
                    autoCapitalize="false"
                    autoCorrect="false"
                    spellCheck="false"
                    className="
                    absolute selection:bg-accent-primary whitespace-nowrap selection:opacity-100
                    selection:text-white z-10 inset-0 pl-[5rem]
                    bg-transparent syntax-textarea resize-none text-transparent caret-white outline-none font-code overflow-auto"/>
                <div ref={ editorRef } className="absolute pointer-events-none flex z-0 inset-0 overflow-hidden whitespace-nowrap">
                    <HighlightedLine cursor={ cursor } tokens={ context.result.tokens }/>
                    <LineNumbers tokens={ context.result.tokens }/>
                    <SyntaxHighlighting ref={ syntaxRef } cursor={ cursor } tokens={ context.result.tokens } />
                </div>
                <SuggestionBox cursor={ cursor } syntaxRef={ syntaxRef }/>
            </div>
            <ErrorArea message={ context.result.error?.message } range={ context.result.error?.range } />
        </Panel>
    )
}

export default EditorWindow