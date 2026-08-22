import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('[PSMS] Root element #root not found in DOM.')
}

createRoot(rootElement).render(
  <StrictMode>
    <>
      <App />
      <Toaster position="top-right" richColors />
    </>
  </StrictMode>
)