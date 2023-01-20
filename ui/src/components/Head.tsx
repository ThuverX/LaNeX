import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { LanexContext } from '../lanex/Context/LanexContext'

const Head = () => {

    const lanexContext = useContext(LanexContext)

    const [ title, setTitle ] = useState('Unnamed document | LaNeX')

    useEffect(() => {
        setTitle(lanexContext.engine.documentInfo.title + ' | LaNeX')
    }, [ lanexContext.result ])

    return (
        <Helmet>
            <title>{ title }</title>
        </Helmet>
    )
}

export default Head