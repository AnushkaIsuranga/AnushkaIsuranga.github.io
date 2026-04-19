import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DotField from './component/DotField.jsx'
import { resolveInitialTheme } from './theme'
import './index.css'

const initialTheme = resolveInitialTheme()

const isMobileUserAgent =
  (navigator.userAgentData?.mobile ?? false) ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const isTouchViewport = window.matchMedia('(hover: none) and (pointer: coarse)').matches
const isMobileViewport = window.matchMedia('(max-width: 1024px)').matches
const shouldDisableBootDotField = isMobileUserAgent || (isTouchViewport && isMobileViewport)

document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme

const bootDotFieldHost = document.getElementById('boot-dotfield')

if (bootDotFieldHost && !shouldDisableBootDotField) {
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
