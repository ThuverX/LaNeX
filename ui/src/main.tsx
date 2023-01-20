import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './style/unreset.scss'
import './style/fonts.scss'
import './style/index.scss'
import './style/document.scss'
import 'katex/dist/katex.min.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
