import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RecordProvider } from './contexts/RecordContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecordProvider>
      <App />
    </RecordProvider>
  </StrictMode>,
)
