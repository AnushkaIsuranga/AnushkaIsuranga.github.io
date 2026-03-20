import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { resolveInitialTheme } from './theme'
import './index.css'

const initialTheme = resolveInitialTheme()

document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
