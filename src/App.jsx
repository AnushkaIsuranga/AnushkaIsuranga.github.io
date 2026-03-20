import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import CustomCursor from './Components/CustomCursor'
import Hero from './Components/Hero'
import Navbar from './Components/Navbar'
import OrientationOverlay from './Components/OrientationOverlay'
import portrait from './assets/my_pic.webp'
import { projectsData } from './content'
import { useProgressLoader } from './hooks/useProgressLoader'
import { useOrientationDetector } from './hooks/useOrientationDetector'
import { THEME_STORAGE_KEY, resolveInitialTheme } from './theme'

const criticalAssets = [portrait, ...projectsData.map((project) => project.image).filter(Boolean)]

const deferredSections = [
  { id: 'about', loader: () => import('./Components/About'), fallbackClassName: 'min-h-[34rem]' },
  { id: 'stack', loader: () => import('./Components/TechStack'), fallbackClassName: 'min-h-[38rem]' },
  { id: 'experience', loader: () => import('./Components/Experience'), fallbackClassName: 'min-h-[42rem]' },
  { id: 'certifications', loader: () => import('./Components/Certifications'), fallbackClassName: 'min-h-[34rem]' },
  { id: 'projects', loader: () => import('./Components/Projects'), fallbackClassName: 'min-h-[52rem]' },
  { id: 'contact', loader: () => import('./Components/Contact'), fallbackClassName: 'min-h-[32rem]' },
]

function DeferredSection({ loader, fallbackClassName }) {
  const [isReady, setIsReady] = useState(false)
  const [SectionComponent, setSectionComponent] = useState(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (isReady) {
      return undefined
    }

    const node = sentinelRef.current
    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReady(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '600px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isReady])

  useEffect(() => {
    if (!isReady || SectionComponent) {
      return undefined
    }

    let cancelled = false

    loader().then((module) => {
      if (!cancelled) {
        setSectionComponent(() => module.default)
      }
    })

    return () => {
      cancelled = true
    }
  }, [SectionComponent, isReady, loader])

  if (!SectionComponent) {
    return <div ref={sentinelRef} className={fallbackClassName} aria-hidden="true" />
  }

  return <SectionComponent />
}

DeferredSection.propTypes = {
  fallbackClassName: PropTypes.string.isRequired,
  loader: PropTypes.func.isRequired,
}

function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(resolveInitialTheme)
  const { complete } = useProgressLoader({
    assetUrls: criticalAssets,
  })
  const { shouldShowOverlay } = useOrientationDetector()

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

      <OrientationOverlay isVisible={shouldShowOverlay} />

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      />

      <main id="content" className="page-main">
        <Hero />
        {deferredSections.map((section) => (
          <DeferredSection
            key={section.id}
            loader={section.loader}
            fallbackClassName={`section-shell ${section.fallbackClassName}`}
          />
        ))}
      </main>
    </div>
  )
}

export default App
