import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import CustomCursor from './Components/CustomCursor'
import ChatbotWidget from './Components/ChatbotWidget'
import Hero from './Components/Hero'
import Navbar from './Components/Navbar'
import OrientationOverlay from './Components/OrientationOverlay'
import Aurora from './component/Aurora'
import portrait from './assets/my_pic.webp'
import { projectsData } from './content'
import { useProgressLoader } from './hooks/useProgressLoader'
import { useOrientationDetector } from './hooks/useOrientationDetector'
import { THEME_STORAGE_KEY, resolveInitialTheme } from './theme'

const criticalAssets = [portrait, ...projectsData.map((project) => project.image).filter(Boolean)]

const fallbackAuroraStops = ['#93c5fd', '#6366f1', '#f8fafc']

const resolveAuroraStopsFromTheme = () => {
  const styles = window.getComputedStyle(document.documentElement)
  const readVar = (name, fallback) => styles.getPropertyValue(name).trim() || fallback

  return [
    readVar('--accent', fallbackAuroraStops[0]),
    readVar('--accent-strong', fallbackAuroraStops[1]),
    readVar('--text', fallbackAuroraStops[2]),
  ]
}

const deferredSections = [
  {
    id: 'about',
    labelledBy: 'about-title',
    sectionClassName: 'section-shell overflow-x-hidden',
    loader: () => import('./Components/About'),
    fallbackClassName: 'min-h-[50rem]',
  },
  {
    id: 'stack',
    labelledBy: 'stack-title',
    sectionClassName: 'section-shell',
    loader: () => import('./Components/TechStack'),
    fallbackClassName: 'min-h-[46rem]',
  },
  {
    id: 'experience',
    labelledBy: 'experience-title',
    sectionClassName: 'section-shell overflow-x-hidden',
    loader: () => import('./Components/Experience'),
    fallbackClassName: 'min-h-[58rem]',
  },
  {
    id: 'certifications',
    labelledBy: 'certifications-title',
    sectionClassName: 'section-shell',
    loader: () => import('./Components/Certifications'),
    fallbackClassName: 'min-h-[40rem]',
  },
  {
    id: 'projects',
    labelledBy: 'projects-title',
    sectionClassName: 'section-shell',
    loader: () => import('./Components/Projects'),
    fallbackClassName: 'min-h-[76rem]',
  },
  {
    id: 'contact',
    labelledBy: 'contact-title',
    sectionClassName: 'section-shell pb-16',
    loader: () => import('./Components/Contact'),
    fallbackClassName: 'min-h-[52rem]',
  },
]

const getScrollPaddingTop = () => {
  const value = window.getComputedStyle(document.documentElement).scrollPaddingTop
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const scrollToSectionWithOffset = (sectionId, behavior = 'smooth') => {
  const element = document.getElementById(sectionId)
  if (!element) return

  element.scrollIntoView({
    behavior,
    block: 'start',
  })
}

function DeferredSection({
  fallbackClassName,
  id,
  isForcedReady,
  labelledBy,
  loader,
  onLoad,
  sectionClassName,
}) {
  const [isReady, setIsReady] = useState(false)
  const [SectionComponent, setSectionComponent] = useState(null)
  const sentinelRef = useRef(null)
  const shouldLoad = isReady || isForcedReady

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
    if (!shouldLoad || SectionComponent) {
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
  }, [SectionComponent, loader, shouldLoad])

  useEffect(() => {
    if (!SectionComponent) {
      return
    }

    onLoad(id)
  }, [SectionComponent, id, onLoad])

  return (
    <section id={id} className={sectionClassName} aria-labelledby={labelledBy}>
      {!SectionComponent ? (
        <div ref={sentinelRef} className={fallbackClassName} aria-hidden="true" />
      ) : (
        <SectionComponent />
      )}
    </section>
  )
}

DeferredSection.propTypes = {
  fallbackClassName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isForcedReady: PropTypes.bool.isRequired,
  labelledBy: PropTypes.string.isRequired,
  loader: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  sectionClassName: PropTypes.string.isRequired,
}

function App() {
  const [loading, setLoading] = useState(true)
  const [loadedSectionIds, setLoadedSectionIds] = useState(() => new Set())
  const [pendingScrollId, setPendingScrollId] = useState(null)
  const [preloadedSectionIds, setPreloadedSectionIds] = useState(() => new Set())
  const [theme, setTheme] = useState(resolveInitialTheme)
  const [auroraColorStops, setAuroraColorStops] = useState(fallbackAuroraStops)
  const lastScrollRequestRef = useRef(null)
  const { complete } = useProgressLoader({
    assetUrls: criticalAssets,
  })
  const { shouldShowOverlay } = useOrientationDetector()

  const handleToggleTheme = () => {
    const root = document.documentElement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      root.classList.add('theme-transition')
    }

    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))

    if (!prefersReducedMotion) {
      window.setTimeout(() => {
        root.classList.remove('theme-transition')
      }, 450)
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    setAuroraColorStops(resolveAuroraStopsFromTheme())
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

  useEffect(() => {
    const handleNavigationRequest = (event) => {
      const sectionId = event.detail?.sectionId

      if (typeof sectionId !== 'string' || sectionId === 'hero') {
        return
      }

      const targetIndex = deferredSections.findIndex((section) => section.id === sectionId)
      if (targetIndex === -1) {
        scrollToSectionWithOffset(sectionId, 'smooth')
        return
      }

      setPreloadedSectionIds((current) => {
        const next = new Set(current)
        deferredSections.slice(0, targetIndex + 1).forEach(({ id }) => next.add(id))
        return next
      })
      setPendingScrollId(sectionId)
    }

    window.addEventListener('portfolio:navigate', handleNavigationRequest)
    return () => window.removeEventListener('portfolio:navigate', handleNavigationRequest)
  }, [])

  useEffect(() => {
    if (!pendingScrollId) {
      return undefined
    }

    if (lastScrollRequestRef.current === pendingScrollId) {
      return undefined
    }

    const targetIndex = deferredSections.findIndex((section) => section.id === pendingScrollId)
    if (targetIndex === -1) {
      return undefined
    }

    const requiredIds = deferredSections.slice(0, targetIndex + 1).map(({ id }) => id)
    const isReadyToScroll = requiredIds.every((id) => loadedSectionIds.has(id))
    if (!isReadyToScroll) {
      return undefined
    }

    lastScrollRequestRef.current = pendingScrollId

    let innerFrameId = 0
    let correctionTimeoutId = 0
    const targetSectionId = pendingScrollId
    const frameId = window.requestAnimationFrame(() => {
      innerFrameId = window.requestAnimationFrame(() => {
        scrollToSectionWithOffset(targetSectionId, 'smooth')

        correctionTimeoutId = window.setTimeout(() => {
          scrollToSectionWithOffset(targetSectionId, 'auto')
          setPendingScrollId(null)
        }, 420)
      })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.cancelAnimationFrame(innerFrameId)
      window.clearTimeout(correctionTimeoutId)
    }
  }, [loadedSectionIds, pendingScrollId])

  if (loading) {
    return null
  }

  return (
    <div className="site-shell">
      <CustomCursor />
      <div className="aurora-shell" aria-hidden="true">
        <Aurora
          colorStops={auroraColorStops}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />

      <OrientationOverlay isVisible={shouldShowOverlay} />
      <ChatbotWidget />

      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main id="content" className="page-main">
        <Hero />
        {deferredSections.map((section) => (
          <DeferredSection
            key={section.id}
            fallbackClassName={section.fallbackClassName}
            id={section.id}
            isForcedReady={preloadedSectionIds.has(section.id)}
            labelledBy={section.labelledBy}
            loader={section.loader}
            onLoad={(loadedSectionId) => {
              setLoadedSectionIds((current) => {
                if (current.has(loadedSectionId)) {
                  return current
                }

                const next = new Set(current)
                next.add(loadedSectionId)
                return next
              })
            }}
            sectionClassName={section.sectionClassName}
          />
        ))}
      </main>
    </div>
  )
}

export default App
