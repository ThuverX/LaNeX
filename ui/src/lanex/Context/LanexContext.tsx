import { createContext } from "react";
import { LaNeXEngine, Node, Token } from "../../../../lib";
import { LanexError } from "../../../../lib/lanex/lanexError";

export interface LanexContext {
    engine: LaNeXEngine<JSX.Element>,
    content: string,
    result: {
        output: JSX.Element
        ast: Node
        tokens: Array<Token>
        error?: LanexError
    },
    sync: {
        currentToken: number,
        setCurrentToken: (token: number) => void
    },
    setContent: (content: string) => void
}

export const LanexContext = createContext<LanexContext>({} as LanexContext)