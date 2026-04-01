import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FiMoon, FiSun } from 'react-icons/fi'
import { AnimatePresence, motion } from 'motion/react'
import favicon from '../assets/favicon.webp'
import { navigationSections, siteContent } from '../content'

function ThemeToggleButton({ onToggleTheme, theme }) {
  const isDarkTheme = theme === 'dark'
  const Icon = isDarkTheme ? FiMoon : FiSun
  const actionLabel = isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'

  return (
    <button
      type="button"
      className="theme-toggle h-11 w-11 shrink-0 justify-center px-0"
      onClick={onToggleTheme}
      aria-label={actionLabel}
      aria-pressed={!isDarkTheme}
      title={actionLabel}
    >
      <Icon className="text-base" />
    </button>
  )
}

ThemeToggleButton.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
}

export default function Navbar({ onToggleTheme, theme }) {
  const [activeSection, setActiveSection] = useState('hero')
  const [isCompact, setIsCompact] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const updateOnScroll = () => {
      setIsCompact(window.scrollY > 36)
    }

    updateOnScroll()
    window.addEventListener('scroll', updateOnScroll, { passive: true })

    const observers = navigationSections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)
      .map((element) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          },
          {
            rootMargin: '-32% 0px -48% 0px',
            threshold: 0.18,
          }
        )

        observer.observe(element)
        return observer
      })

    return () => {
      window.removeEventListener('scroll', updateOnScroll)
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [isMobileOpen])

  const scrollToSection = (sectionId) => {
    if (sectionId === 'hero') {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { sectionId } }))
    }

    setIsMobileOpen(false)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="Close mobile navigation"
          className="pointer-events-auto fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-md md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <motion.nav
        className="nav-shell pointer-events-auto relative z-50 mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 rounded-[1.6rem] pl-3 pr-3 py-3"
        animate={{
          paddingTop: isCompact ? '0.6rem' : '0.8rem',
          paddingBottom: isCompact ? '0.6rem' : '0.8rem',
          maxWidth: isCompact ? '1180px' : '1240px',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 rounded-2xl px-2 py-1.5 text-left"
          aria-label="Scroll to the top of the page"
        >
          <img
            src={favicon}
            alt=""
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 object-cover p-1 shadow-[0_14px_32px_rgba(8,15,30,0.36)]"
          />

          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-white">{siteContent.site.name}</span>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400">
              {siteContent.site.role}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200"
            onClick={() => setIsMobileOpen((current) => !current)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-panel"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition-all duration-300 ${
                  isMobileOpen ? 'top-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[2px] w-5 rounded bg-current transition-all duration-300 ${
                  isMobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[2px] w-5 rounded bg-current transition-all duration-300 ${
                  isMobileOpen ? 'top-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        <div className="hidden md:ml-auto md:flex">
          <div className="no-scrollbar inline-flex w-fit items-center gap-1 overflow-x-auto rounded-full bg-white/[0.03] p-1">
            {navigationSections.map((section) => {
              const isActive = activeSection === section.id

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="relative flex h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white"
                  aria-label={`Go to ${section.label}`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(125,211,252,0.18),rgba(99,102,241,0.22),rgba(167,139,250,0.18))]"
                      transition={{
                        type: 'spring',
                        stiffness: 360,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  <span className="relative z-10">{section.label}</span>
                </button>
              )
            })}

            <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            id="mobile-nav-panel"
            className="nav-shell pointer-events-auto relative z-50 mx-auto mt-2 w-full max-w-[1240px] rounded-[1.35rem] p-2 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-1">
              {navigationSections.map((section) => {
                const isActive = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[linear-gradient(135deg,rgba(125,211,252,0.18),rgba(99,102,241,0.22),rgba(167,139,250,0.18))] text-white'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                    aria-label={`Go to ${section.label}`}
                  >
                    {section.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

Navbar.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
}
