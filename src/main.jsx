import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DotField from './component/DotField.jsx'
import { resolveInitialTheme } from './theme'
import './index.css'

const initialTheme = resolveInitialTheme()

document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme

const bootDotFieldHost = document.getElementById('boot-dotfield')

if (bootDotFieldHost) {
  const bootDotFieldRoot = createRoot(bootDotFieldHost)

  bootDotFieldRoot.render(
    <DotField
      dotRadius={1.5}
      dotSpacing={14}
      bulgeStrength={67}
      glowRadius={160}
      sparkle={false}
      waveAmplitude={0}
      cursorRadius={500}
      cursorForce={0.1}
      bulgeOnly
      gradientFrom="#A855F7"
      gradientTo="#B497CF"
      glowColor="#120F17"
    />,
  )

  window.addEventListener(
    'bootloader:hide',
    () => {
      bootDotFieldRoot.unmount()
    },
    { once: true },
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
