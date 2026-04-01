import { useRef, useState } from 'react'
import { FaBuilding, FaBrain, FaCogs } from 'react-icons/fa'
import { motion } from 'motion/react'
import MobileParallax from '../Animation/MobileParallax'
import Reveal from '../Animation/Reveal'
import { portfolioStats, siteContent } from '../content'

const principleIconMap = {
  building: FaBuilding,
  brain: FaBrain,
  gears: FaCogs,
}

export default function About() {
  const [activePrinciple, setActivePrinciple] = useState(0)
  const touchStartX = useRef(null)

  const highlights = [
    {
      value: portfolioStats.projectCount,
      label: siteContent.about.highlightLabels.projects,
    },
    {
      value: portfolioStats.coreLaneCount,
      label: `${siteContent.about.highlightLabels.coreLanesPrefix} ${siteContent.site.coreLanes.join(', ')}`,
    },
    {
      value: portfolioStats.firstWorkYear ?? 'Now',
      label: siteContent.about.highlightLabels.workStart,
    },
  ]

  const principles = siteContent.about.principles

  const goToPrinciple = (nextIndex) => {
    const total = principles.length
    if (!total) return
    const wrappedIndex = ((nextIndex % total) + total) % total
    setActivePrinciple(wrappedIndex)
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX
    touchStartX.current = null

    if (startX === null || typeof endX !== 'number') return

    const deltaX = endX - startX
    if (Math.abs(deltaX) < 36) return

    deltaX < 0 ? goToPrinciple(activePrinciple + 1) : goToPrinciple(activePrinciple - 1)
  }

  return (
    <div className="section-inner">
      <div className="section-header max-w-3xl">
        <Reveal>
          <span className="section-label">About</span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id="about-title"
            className="section-title bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
          >
            {siteContent.about.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="section-copy max-w-2xl">{siteContent.about.copy}</p>
        </Reveal>
      </div>

      <div className="mt-10 grid w-full min-w-0 gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="min-w-0">
          <Reveal>
            <MobileParallax offset={20}>
              <div className="editorial-card w-full overflow-hidden rounded-[2rem] p-4 sm:p-6 md:p-8">
                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div key={item.label} className="surface-muted rounded-[1.5rem] p-4 sm:p-5">
                      <p className="metric-value text-white">{item.value}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 md:hidden">
                  <div
                    className="relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    aria-label="Principles slider"
                  >
                    <motion.div
                      className="flex"
                      animate={{ x: `-${activePrinciple * 100}%` }}
                      transition={{ duration: 0.32, ease: 'easeOut' }}
                    >
                      {principles.map(({ title, text, iconKey }, index) => {
                        const Icon = principleIconMap[iconKey]
                        return (
                          <motion.div
                            key={title}
                            className="w-full min-w-full shrink-0"
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                          >
                            <div className="surface-muted rounded-[1.5rem] p-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-lg text-[#7dd3fc]">
                                {Icon ? <Icon /> : null}
                              </div>
                              <h3 className="mt-4 text-base font-semibold text-white sm:text-lg">
                                {title}
                              </h3>
                              <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </div>

                  <div
                    className="mt-4 flex items-center justify-center gap-2"
                    aria-label="Principles slide progress"
                  >
                    {principles.map((principle, index) => {
                      const isActive = index === activePrinciple
                      return (
                        <button
                          key={principle.title}
                          type="button"
                          onClick={() => goToPrinciple(index)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            isActive ? 'w-6 bg-sky-300' : 'w-2.5 bg-white/30 hover:bg-white/50'
                          }`}
                          aria-label={`Go to ${principle.title}`}
                          aria-current={isActive ? 'true' : 'false'}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="mt-6 hidden gap-3 md:grid md:grid-cols-3">
                  {principles.map(({ title, text, iconKey }, index) => {
                    const Icon = principleIconMap[iconKey]
                    return (
                      <motion.div
                        key={title}
                        className="surface-muted rounded-[1.5rem] p-5"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-lg text-[#7dd3fc]">
                          {Icon ? <Icon /> : null}
                        </div>
                        <h3 className="mt-5 text-base font-semibold text-white lg:text-lg">
                          {title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="surface-muted mt-6 rounded-[1.75rem] p-4 sm:p-6">
                  <p className="metric-label text-indigo-300">
                    {siteContent.about.workingStyle.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                    {siteContent.about.workingStyle.text}
                  </p>
                </div>
              </div>
            </MobileParallax>
          </Reveal>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="min-w-0">
            <Reveal direction="left">
              <div className="glass-panel w-full rounded-[2rem] p-4 sm:p-6 md:p-7">
                <p className="section-label">Capabilities</p>
                <div className="mt-5 space-y-3">
                  {siteContent.about.capabilities.map((item, index) => (
                    <motion.div
                      key={item}
                      className="surface-muted rounded-[1.4rem] px-4 py-3 sm:px-5 sm:py-4"
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                    >
                      <p className="text-sm leading-6 text-slate-300 sm:leading-7">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="min-w-0">
            <Reveal direction="left" delay={0.08}>
              <div className="glass-panel w-full rounded-[2rem] p-4 sm:p-6 md:p-7">
                <p className="section-label">Current priorities</p>
                <div className="mt-5 space-y-3">
                  {siteContent.about.priorities.map((item, index) => (
                    <motion.div
                      key={item}
                      className="surface-muted rounded-[1.4rem] px-4 py-3 sm:px-5 sm:py-4"
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                    >
                      <p className="text-sm leading-6 text-slate-300 sm:leading-7">{item}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="surface-muted mt-6 rounded-[1.5rem] p-4 sm:p-5">
                  <p className="metric-label text-indigo-300">
                    {siteContent.about.stackNote.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                    {siteContent.about.stackNote.text}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
