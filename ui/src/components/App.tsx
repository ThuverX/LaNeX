import { useEffect, useState } from 'react'
import { LanexContext } from '../lanex/Context/LanexContext'
import { ReactRenderer } from '../lanex/ReactRenderer'
import { LaNeXEngine, Node, Token } from '../../../lib'
import EditorWindow from './Editor/EditorWindow'
import PreviewWindow from './Preview/PreviewWindow'
import Toolbar from './Toolbar/Toolbar'
import VSpacer from './VSpacer'
import { LanexError } from '../../../lib/lanex/lanexError'
import { AppContext } from '../context/appcontext'
import Head from './Head'

const App = () => {

    const [ engine ] = useState(new LaNeXEngine(new ReactRenderer()))
    const [ content, setContent ] = useState('')
    const [ result, setResult ] = useState<{
        output: JSX.Element
        ast: Node
        tokens: Array<Token>
        error?: LanexError
    }>({
        output: <></>,
        ast: {} as Node,
        tokens: []
    })
    const [ currentToken, setCurrentToken ] = useState<number>(0)

    const [ darkmode, setDarkmode ] = useState<boolean>(true)

    useEffect(() => {
        let value = engine.render(content)
        setResult(value)

        // @ts-ignore
        window.result = value

        // @ts-ignore
        window.engine = engine

        // @ts-ignore
        window.content = content
    }, [ content ])

    return (
        <AppContext.Provider value={{ darkmode, setDarkmode }}>
            <div className='flex flex-col bg-dark-500 text-white h-screen overflow-hidden'>
                <LanexContext.Provider value={{
                    engine,
                    content,
                    result,
                    setContent,
                    sync: {
                        currentToken,
                        setCurrentToken
                    }
                }}>
                    <Head/>
                    <Toolbar/>
                    <main className='flex flex-grow h-[calc(100vh-4rem)]'>
                        <EditorWindow/>
                        <PreviewWindow/>
                    </main>
                </LanexContext.Provider>
            </div>
        </AppContext.Provider>
    )
}

export default App
