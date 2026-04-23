import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import DotField from './component/DotField.jsx'
import { resolveInitialTheme } from './theme'
import './index.css'

const initialTheme = resolveInitialTheme()
const siteName = import.meta.env.VITE_SITE_NAME || 'Anushka Isuranga'
const siteEmail = 'isuranga880@gmail.com'

const consoleBanner = [
  '          █████╗        ██╗',
  '         ██╔══██╗       ╚═╝',
  '        █████████╗    ████║',
  '       ██╔══════██╗     ██║',
  '      ██║        ██║  ██████║',
  '      ╚═╝        ╚═╝  ╚═════╝',
]

function logPortfolioBanner(theme) {
  if (typeof window === 'undefined' || typeof window.console?.log !== 'function') {
    return
  }

  const isLightTheme = theme === 'light'

  const text = isLightTheme ? '#0f172a' : '#e2e8f0'
  const muted = isLightTheme ? '#475569' : '#94a3b8'
  const blue = isLightTheme ? '#2563eb' : '#93c5fd'
  const sky = isLightTheme ? '#0284c7' : '#7dd3fc'
  const indigo = isLightTheme ? '#4f46e5' : '#818cf8'
  const violet = isLightTheme ? '#7c3aed' : '#c084fc'
  const deepViolet = isLightTheme ? '#6366f1' : '#a78bfa'
  const emerald = isLightTheme ? '#15803d' : '#86efac'
  const mono = 'font-family:Consolas,Menlo,Monaco,"Courier New",monospace'

  const logoStyles = [
    [`color:${sky}`, 'font-size:13px', 'font-weight:700', 'line-height:1.05', mono].join(';'),
    [`color:${blue}`, 'font-size:13px', 'font-weight:700', 'line-height:1.05', mono].join(';'),
    [`color:${indigo}`, 'font-size:13px', 'font-weight:700', 'line-height:1.05', mono].join(';'),
    [`color:${violet}`, 'font-size:13px', 'font-weight:700', 'line-height:1.05', mono].join(';'),
    [`color:${deepViolet}`, 'font-size:13px', 'font-weight:700', 'line-height:1.05', mono].join(';'),
    [`color:${emerald}`, 'font-size:13px', 'font-weight:700', 'line-height:1.05', mono].join(';'),
  ]

  const pillStyle = [
    `color:${text}`,
    `background:${indigo}`,
    'padding:5px 10px',
    'border-radius:999px',
    'font-weight:700',
    'letter-spacing:0.12em',
    'text-transform:uppercase',
    mono,
  ].join(';')

  const accentStyle = [`color:${violet}`, 'font-weight:700', mono].join(';')
  const labelStyle = [
    `color:${muted}`,
    'font-weight:700',
    'letter-spacing:0.12em',
    'text-transform:uppercase',
    mono,
  ].join(';')
  const valueStyle = [`color:${text}`, mono].join(';')
  const codeStyle = [`color:${emerald}`, 'font-weight:700', mono].join(';')

  console.log(
    consoleBanner.map((line) => `%c${line}`).join('\n'),
    ...logoStyles,
  )

  console.log(
    '%cHELLO WORLD!',
    pillStyle,
  )

  console.log(
    '%ccurious enough to open DevTools? we should talk.',
    accentStyle,
  )

  console.log('%cNAME     %c' + siteName, labelStyle, valueStyle)
  console.log('%cEMAIL    %c' + siteEmail, labelStyle, valueStyle)
}

const isMobileUserAgent =
  (navigator.userAgentData?.mobile ?? false) ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const isTouchViewport = window.matchMedia('(hover: none) and (pointer: coarse)').matches
const isMobileViewport = window.matchMedia('(max-width: 1024px)').matches
const shouldDisableBootDotField = isMobileUserAgent || (isTouchViewport && isMobileViewport)

document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme
logPortfolioBanner(initialTheme)

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