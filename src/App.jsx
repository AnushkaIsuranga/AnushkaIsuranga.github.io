import { useEffect, useState } from 'react'
import About from './Components/About'
import Certifications from './Components/Certifications'
import Contact from './Components/Contact'
import CustomCursor from './Components/CustomCursor'
import Experience from './Components/Experience'
import Hero from './Components/Hero'
import Navbar from './Components/Navbar'
import Projects from './Components/Projects'
import TechStack from './Components/TechStack'
import portrait from './assets/my_pic.webp'
import { useProgressLoader } from './hooks/useProgressLoader'
import { THEME_STORAGE_KEY, resolveInitialTheme } from './theme'

const criticalAssets = [portrait]

function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(resolveInitialTheme)
  const { complete } = useProgressLoader({
    assetUrls: criticalAssets,
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = loading ? 'hidden' : previousOverflow

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [loading])

  useEffect(() => {
    if (!complete) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      window.__portfolioBootLoader?.hide?.()
      setLoading(false)
    }, 360)

    return () => window.clearTimeout(timeoutId)
  }, [complete])

  useEffect(() => {
    if (!loading) {
      return undefined
    }

    const fallbackId = window.setTimeout(() => {
      window.__portfolioBootLoader?.setStatus?.('Launching interface')
      window.__portfolioBootLoader?.setProgress?.(100)
      window.__portfolioBootLoader?.hide?.()
      setLoading(false)
    }, 12000)

    return () => window.clearTimeout(fallbackId)
  }, [loading])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') {
        return
      }

      window.__portfolioBootLoader?.setStatus?.('Skipping intro')
      window.__portfolioBootLoader?.setProgress?.(100)
      window.__portfolioBootLoader?.hide?.()
      setLoading(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return null
  }

  return (
    <div className="site-shell">
      <CustomCursor />
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      />

      <main id="content" className="page-main">
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Certifications />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}

export default App
