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
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, scale: 0.7, rotate: -24 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, rotate: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <Icon className="text-base" />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

ThemeToggleButton.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
}

export default function Navbar({ onToggleTheme, theme }) {
  const [isCompact, setIsCompact] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const updateOnScroll = () => {
      const doc = document.documentElement
      const scrollTop = Math.max(window.scrollY, 0)
      const scrollableHeight = Math.max(doc.scrollHeight - window.innerHeight, 1)

      setIsCompact(window.scrollY > 36)
      setScrollProgress(Math.min(100, (scrollTop / scrollableHeight) * 100))

      let currentSectionId = 'hero'
      const threshold = window.innerHeight * 0.35

      for (const section of navigationSections) {
        const node = document.getElementById(section.id)
        if (!node) {
          continue
        }

        const { top } = node.getBoundingClientRect()
        if (top <= threshold) {
          currentSectionId = section.id
        }
      }

      setActiveSection(currentSectionId)
    }

    updateOnScroll()
    window.addEventListener('scroll', updateOnScroll, { passive: true })
    window.addEventListener('resize', updateOnScroll)

    return () => {
      window.removeEventListener('scroll', updateOnScroll)
      window.removeEventListener('resize', updateOnScroll)
    }
  }, [])

  const activeIndex = Math.max(
    0,
    navigationSections.findIndex((section) => section.id === activeSection),
  )
  const nextSection = navigationSections[Math.min(activeIndex + 1, navigationSections.length - 1)]

  const scrollToSection = (sectionId) => {
    if (sectionId === 'hero') {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { sectionId } }))
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
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

          <span className="hidden md:block">
            <span className="block text-sm font-semibold text-white">{siteContent.site.name}</span>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400">
              {siteContent.site.role}
            </span>
          </span>
        </button>

        <div className="min-w-0 flex-1 px-1">
          <div className="mx-auto flex w-full max-w-[34rem] flex-col gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
              <motion.span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#7dd3fc_0%,#818cf8_56%,#a78bfa_100%)]"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            </div>

          </div>
        </div>

        <ThemeToggleButton theme={theme} onToggleTheme={onToggleTheme} />
      </motion.nav>
    </div>
  )
}

Navbar.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['dark', 'light']).isRequired,
}
