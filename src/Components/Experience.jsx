import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import MobileParallax from '../Animation/MobileParallax'
import Reveal from '../Animation/Reveal'
import {
  currentLeadership,
  currentWork,
  experienceCounts,
  experiencesData,
  latestEducation,
  siteContent,
} from '../content'

const experienceTypes = ['Work', 'Education', 'Leadership']

function ShootingStarLine({ timelineRef }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const prevYRef = useRef(0)
  const [lineHeight, setLineHeight] = useState(0)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  })

  // Snappier spring than before — less lag, still feels alive
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  })

  // Orb y = progress × full height of the container
  const orbTop = useTransform(smoothProgress, [0, 1], [0, lineHeight])

  // Keep canvas size in sync
  useEffect(() => {
    const container = timelineRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const sync = () => {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
      setLineHeight(container.offsetHeight)
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(container)
    return () => ro.disconnect()
  }, [timelineRef])

  // Spawn particles only when the orb actually moves (≥3px delta)
  useEffect(() => {
    const unsub = smoothProgress.on('change', (progress) => {
      const canvas = canvasRef.current
      if (!canvas || canvas.height === 0) return

      const currentY = progress * canvas.height
      const dy = currentY - prevYRef.current
      prevYRef.current = currentY

      if (Math.abs(dy) < 3) return

      const lineX = window.innerWidth >= 640 ? 8 : 7
      // Max 3 particles per tick — much lighter than before
      const count = Math.min(Math.ceil(Math.abs(dy) / 8), 3)

      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: lineX + (Math.random() - 0.5) * 3,
          // Spread behind the orb along the travel direction
          y: currentY - dy * (i / count) * 0.45,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.35,
          life: 0.55 + Math.random() * 0.2,
          decay: 0.038 + Math.random() * 0.014,
          radius: Math.random() * 1.4 + 0.5,
          hue: 210 + Math.random() * 30,
        })
      }
    })
    return unsub
  }, [smoothProgress])

  // RAF draw loop — plain filled circles only (no radial gradient per particle)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.01)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.vx *= 0.93
        p.vy *= 0.93

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 75%, 80%, ${Math.max(0, p.life)})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const linePos = 'left-[0.45rem] sm:left-2'

  return (
    <>
      {/* 1. Dim full-height track */}
      <div className={`absolute ${linePos} top-0 h-full w-px bg-white/[0.08]`} aria-hidden="true" />

      {/* 2. Scroll-driven fill — grows from top as user scrolls */}
      <motion.div
        className={`absolute ${linePos} top-0 w-px origin-top`}
        style={{
          scaleY: smoothProgress,
          height: '100%',
          background: 'linear-gradient(to bottom, #7dd3fc 0%, #818cf8 55%, #a78bfa 100%)',
          opacity: 0.9,
        }}
        aria-hidden="true"
      />

      {/* 3. Canvas — particle trail floats over the section */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0"
        aria-hidden="true"
      />

      {/* 4. Orb — lives at the exact bottom tip of the fill.
              One pulse ring + one small bright core. That's it. */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          left: 'calc(0.45rem)',
          top: orbTop,
          x: '-50%',
          y: '-50%',
        }}
        aria-hidden="true"
      >
        {/* Single pulse ring — gentle, not aggressive */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 16,
            height: 16,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-full w-full rounded-full bg-sky-300/20" />
        </motion.div>

        {/* Core dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#f0f9ff',
            boxShadow: '0 0 5px 2px rgba(125,211,252,0.75)',
          }}
        />
      </motion.div>
    </>
  )
}

// ─── Main Experience component ───────────────────────────────────────────────
export default function Experience() {
  const timelineRef = useRef(null)

  const summaryCards = experienceTypes.map((type) => ({
    label: type,
    value: String(experienceCounts[type] ?? 0),
  }))

  const overviewPanels = [
    {
      label: siteContent.experienceSection.overviewLabels.currentRole,
      value: currentWork?.role ?? 'Software Engineer',
      detail: currentWork?.title ?? 'Professional experience',
    },
    {
      label: siteContent.experienceSection.overviewLabels.academicTrack,
      value: latestEducation?.role ?? 'Software Engineering',
      detail: latestEducation?.title ?? 'Formal study path',
    },
    {
      label: siteContent.experienceSection.overviewLabels.leadership,
      value: currentLeadership?.role ?? 'Technology leadership',
      detail: currentLeadership?.title ?? 'Community contribution',
    },
  ]

  return (
    <div className="section-inner">
      {/* Header */}
      <div className="section-header max-w-3xl">
        <Reveal>
          <span className="section-label">Experience</span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id="experience-title"
            className="section-title bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
          >
            {siteContent.experienceSection.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="section-copy max-w-2xl">{siteContent.experienceSection.copy}</p>
        </Reveal>
      </div>

      {/* Overview panels */}
      <Reveal delay={0.14} className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {overviewPanels.map((panel) => (
            <div key={panel.label} className="surface-muted rounded-[1.5rem] p-5">
              <p className="metric-label text-[#7dd3fc]">{panel.label}</p>
              <p className="mt-4 text-lg font-semibold text-white">{panel.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{panel.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Summary stat cards */}
      <Reveal delay={0.18} className="mt-4">
        <div className="grid grid-cols-3 gap-4">
          {summaryCards.map((item) => (
            <div key={item.label} className="stat-card">
              <p className="metric-value text-white">{item.value}</p>
              <p className="metric-label mt-3">{item.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Timeline */}
      <div ref={timelineRef} className="relative mt-10 pl-4 sm:pl-6">
        <ShootingStarLine timelineRef={timelineRef} />

        <div className="space-y-5">
          {experiencesData.map((experience, index) => (
            <Reveal
              key={`${experience.title}-${experience.period}`}
              direction={index % 2 === 0 ? 'up' : 'left'}
              delay={index * 0.05}
            >
              <article className="relative pl-6 sm:pl-8">
                <span className="timeline-marker absolute left-[-0.05rem] top-7 flex h-4 w-4 items-center justify-center rounded-full sm:left-[0.1rem]">
                  <span className="h-2 w-2 rounded-full bg-indigo-300" />
                </span>

                <div className="grid gap-4 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start">
                  <div className="space-y-3 lg:pt-5">
                    <p className="metric-label text-white/55">{experience.period}</p>
                    <span className="eyebrow-chip">{experience.type}</span>
                  </div>

                  <MobileParallax offset={20}>
                    <motion.div
                      className="editorial-card w-full overflow-hidden rounded-[1.85rem] p-5 sm:p-7"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(200px,0.5fr)] md:items-start">
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl md:text-[1.9rem]">
                            {experience.role}
                          </h3>
                          <p className="mt-2 text-base font-medium text-slate-200">
                            {experience.title}
                          </p>
                        </div>

                        <div className="surface-muted rounded-[1.25rem] px-4 py-4">
                          <p className="metric-label text-white/50">Primary focus</p>
                          <p className="mt-3 text-sm font-medium leading-7 text-white">
                            {experience.focus[0]}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                        {experience.summary}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {experience.focus.map((item) => (
                          <span key={item} className="skill-pill text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </MobileParallax>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
