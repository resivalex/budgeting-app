import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider as JotaiProvider } from 'jotai'
import { AppContainer } from './components'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <JotaiProvider>
      <BrowserRouter>
        <AppContainer />
      </BrowserRouter>
    </JotaiProvider>
  </React.StrictMode>,
)
