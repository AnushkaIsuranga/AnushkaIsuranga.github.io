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
  const orbRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const prevProgressRef = useRef(0)
  const lineXRef = useRef(8) // pixel x of the line inside the container
  const [lineHeight, setLineHeight] = useState(0)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 90%', 'end 10%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
    restDelta: 0.0005,
  })

  const orbTop = useTransform(smoothProgress, [0, 1], [0, lineHeight])

  useEffect(() => {
    const container = timelineRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const sync = () => {
      const w = container.offsetWidth
      const h = container.offsetHeight
      canvas.width = w
      canvas.height = h
      setLineHeight(h)

      lineXRef.current = window.innerWidth >= 640 ? 8 : 7
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(container)
    return () => ro.disconnect()
  }, [timelineRef])

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (progress) => {
      const canvas = canvasRef.current
      if (!canvas || canvas.height === 0) return

      const currentY = progress * canvas.height
      const prevY = prevProgressRef.current * canvas.height
      const dy = currentY - prevY
      prevProgressRef.current = progress

      if (Math.abs(dy) < 2) return

      const spawnX = lineXRef.current
      const steps = Math.min(Math.ceil(Math.abs(dy) / 4), 5)

      for (let i = 0; i < steps; i++) {
        const t = i / steps
        const spawnY = currentY - dy * (1 - t) * 0.6

        particlesRef.current.push({
          x: spawnX + (Math.random() - 0.5) * 5,
          y: spawnY,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 0.8 - dy * 0.04,
          life: 0.85 + Math.random() * 0.15,
          decay: 0.022 + Math.random() * 0.014,
          radius: Math.random() * 2.2 + 0.8,
          hue: 200 + Math.random() * 45,
          sat: 70 + Math.random() * 25,
          lit: 72 + Math.random() * 22,
        })
      }
    })
    return unsubscribe
  }, [smoothProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.02)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.vx *= 0.96 // gentle air-drag
        p.vy *= 0.96

        const alpha = Math.max(0, p.life)

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5)
        grd.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.lit}%, ${alpha * 0.9})`)
        grd.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.lit}%, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, 95%, ${alpha})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const lineX = 'left-[0.45rem] sm:left-2'

  return (
    <>
      
      <div
        className={`absolute ${lineX} top-0 h-full w-px bg-white/[0.07]`}
        aria-hidden="true"
      />

      
      <motion.div
        className={`absolute ${lineX} top-0 w-px origin-top`}
        style={{
          scaleY: smoothProgress,
          height: '100%',
          background:
            'linear-gradient(to bottom, rgba(125,211,252,0.9) 0%, rgba(129,140,248,0.85) 55%, rgba(167,139,250,0.7) 100%)',
        }}
        aria-hidden="true"
      />

      
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0"
        aria-hidden="true"
      />

      
      <motion.div
        ref={orbRef}
        className="pointer-events-none absolute"
        style={{
          left: 'calc(0.45rem)',
          top: orbTop,
          x: '-50%',
          y: '-50%',
        }}
        aria-hidden="true"
      >
        
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 26,
            height: 26,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            background: 'rgba(125,211,252,0.12)',
            boxShadow: '0 0 18px 6px rgba(125,211,252,0.25)',
          }}
          animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 14,
            height: 14,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            background: 'rgba(165,180,252,0.25)',
            boxShadow: '0 0 10px 3px rgba(129,140,248,0.45)',
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.3, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        />

        
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 35%, #ffffff, #93c5fd)',
            boxShadow:
              '0 0 8px 3px rgba(125,211,252,0.9), 0 0 2px 1px rgba(255,255,255,0.95)',
          }}
        />
      </motion.div>
    </>
  )
}

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
    <section
      id="experience"
      className="section-shell overflow-x-hidden"
      aria-labelledby="experience-title"
    >
      <div className="section-inner">
        
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

        
        <Reveal delay={0.18} className="mt-4">
          <div className="grid gap-4 grid-cols-3">
            {summaryCards.map((item) => (
              <div key={item.label} className="stat-card">
                <p className="metric-value text-white">{item.value}</p>
                <p className="metric-label mt-3">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        
        
        <div
          ref={timelineRef}
          className="relative mt-10 pl-4 sm:pl-6"
        >
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
    </section>
  )
}