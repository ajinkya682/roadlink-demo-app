import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { DialogProvider } from './context/DialogContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DialogProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </DialogProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
