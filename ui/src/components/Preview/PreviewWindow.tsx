import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/appcontext'
import { LanexContext } from '../../lanex/Context/LanexContext'
import Panel from '../Panel'

const PreviewWindow = () => {

    const context = useContext(LanexContext)
    const appContext = useContext(AppContext)

    const wrapperRef = React.createRef<HTMLDivElement>()

    useEffect(() => {
        let currentToken = context.sync.currentToken

        if( wrapperRef.current ) {
            let element = wrapperRef.current.querySelector(`[data-range-from="${ currentToken }"]`)
            if(element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                element.classList.add('blink')
                element.addEventListener('animationend', () => {
                    element!.classList.remove('blink')
                }, { once: true })
            }
        }
    }, [ context.sync.currentToken ])

    return (
        <Panel className={`${ appContext.darkmode ? 'bg-dark-500' : 'bg-white' } overflow-auto color-switch`}>
            <div ref={ wrapperRef } className={`${ appContext.darkmode ? 'bg-dark-500 text-white' : 'bg-white text-black' } break-words mx-auto my-2 w-[210mm] unreset flex-grow`}>
                <div className='whitespace-pre-line document font-document'>{ context.result.output }</div>
            </div>
        </Panel>
    )
}

export default PreviewWindow