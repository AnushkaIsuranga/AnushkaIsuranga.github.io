import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [data-cursor="interactive"]'
const TEXT_SELECTOR =
  'p, h1, h2, h3, h4, h5, h6, span, li, blockquote, [data-cursor="text"]'

function makeSpring(stiffness = 0.12, damping = 0.78) {
  let vel = 0
  return (current, target) => {
    const force = (target - current) * stiffness
    vel = vel * damping + force
    return current + vel
  }
}

function sampleElementColor(el) {
  if (!el) return null
  const style = getComputedStyle(el)
  const candidates = [
    style.backgroundColor,
    style.borderColor,
    style.color,
  ]
  for (const c of candidates) {
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent' && !c.includes('255, 255, 255')) {
      return c
    }
  }
  return null
}

const MAX_PARTICLES = 18

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)

  const dotRef    = useRef(null)
  const ringRef   = useRef(null)
  const glowRef   = useRef(null)
  const canvasRef = useRef(null)

  const mouse      = useRef({ x: -200, y: -200 })
  const dotPos     = useRef({ x: -200, y: -200 })
  const ringPos    = useRef({ x: -200, y: -200 })
  const velocity   = useRef({ x: 0, y: 0 })
  const prevMouse  = useRef({ x: -200, y: -200 })
  const modeRef    = useRef('default')  // default | interactive | text | pressed | hidden
  const accentRef  = useRef(null)       // sampled CSS color string | null
  const magnetRef  = useRef(null)       // { x, y, w, h } of magnetic target rect
  const visibleRef = useRef(false)
  const frameRef   = useRef(0)
  const particles  = useRef([])

  const springX = useRef(makeSpring(0.095, 0.76))
  const springY = useRef(makeSpring(0.095, 0.76))

  useEffect(() => {
    const hover   = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const check   = () => setEnabled(hover.matches && !reduced.matches)
    check()
    hover.addEventListener('change', check)
    reduced.addEventListener('change', check)
    return () => {
      hover.removeEventListener('change', check)
      reduced.removeEventListener('change', check)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor')
      document.body.classList.remove('has-custom-cursor')
      return
    }

    document.documentElement.classList.add('has-custom-cursor')
    document.body.classList.add('has-custom-cursor')

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const resolve = (target) => {
      if (!target) return

      const interactive = target.closest(INTERACTIVE_SELECTOR)
      const text        = target.closest(TEXT_SELECTOR)

      if (interactive) {
        modeRef.current   = 'interactive'
        accentRef.current = sampleElementColor(interactive)
        const rect = interactive.getBoundingClientRect()
        magnetRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width, h: rect.height }
      } else if (text) {
        modeRef.current   = 'text'
        accentRef.current = null
        magnetRef.current = null
      } else {
        modeRef.current   = 'default'
        accentRef.current = null
        magnetRef.current = null
      }
    }

    const spawnParticle = (x, y, speed) => {
      if (particles.current.length >= MAX_PARTICLES) return
      const angle  = Math.random() * Math.PI * 2
      const mag    = Math.random() * 1.2 + 0.3
      const size   = Math.random() * 3 + 1.5
      const accent = accentRef.current
      const defaultParticleColor =
        getComputedStyle(document.documentElement).getPropertyValue('--cursor-particle').trim() ||
        'rgba(125, 211, 252, 0.9)'
      particles.current.push({
        x, y,
        vx: Math.cos(angle) * mag * (speed * 0.18 + 0.4),
        vy: Math.sin(angle) * mag * (speed * 0.18 + 0.4),
        life: 1,
        decay: Math.random() * 0.04 + 0.025,
        size,
        color: accent || defaultParticleColor,
      })
    }

    let spawnThrottle = 0

    const onMove = (e) => {
      prevMouse.current  = { ...mouse.current }
      mouse.current      = { x: e.clientX, y: e.clientY }
      velocity.current   = {
        x: e.clientX - prevMouse.current.x,
        y: e.clientY - prevMouse.current.y,
      }

      if (!visibleRef.current) {
        dotPos.current  = { x: e.clientX, y: e.clientY }
        ringPos.current = { x: e.clientX, y: e.clientY }
        springX.current = makeSpring(0.095, 0.76)
        springY.current = makeSpring(0.095, 0.76)
      }
      visibleRef.current = true

      if (modeRef.current !== 'pressed') resolve(e.target)

      const speed = Math.hypot(velocity.current.x, velocity.current.y)
      spawnThrottle++
      if (spawnThrottle % 2 === 0 && speed > 2.5) {
        spawnParticle(e.clientX, e.clientY, speed)
      }
    }

    const onDown = (e) => {
      modeRef.current = 'pressed'
      for (let i = 0; i < 7; i++) spawnParticle(e.clientX, e.clientY, 6)
    }

    const onUp = (e) => {
      resolve(e.target)
    }

    const onLeave  = () => { visibleRef.current = false }
    const onEnter  = (e) => { visibleRef.current = true; resolve(e.target) }
    const onBlur   = () => { visibleRef.current = false; modeRef.current = 'default' }

    const RING_BASE = 38
    const DOT_BASE  = 7

    const loop = () => {
      const m    = mouse.current
      const mode = modeRef.current
      const vis  = visibleRef.current

      dotPos.current.x += (m.x - dotPos.current.x) * 0.42
      dotPos.current.y += (m.y - dotPos.current.y) * 0.42

      let targetRingX = m.x
      let targetRingY = m.y

      if (magnetRef.current && mode === 'interactive') {
        const mag = magnetRef.current
        const dx  = m.x - mag.x
        const dy  = m.y - mag.y
        const dist = Math.hypot(dx, dy)
        const pull = Math.max(0, 1 - dist / 120)
        targetRingX = m.x - dx * pull * 0.38
        targetRingY = m.y - dy * pull * 0.38
      }

      ringPos.current.x = springX.current(ringPos.current.x, targetRingX)
      ringPos.current.y = springY.current(ringPos.current.y, targetRingY)

      const vx    = velocity.current.x
      const vy    = velocity.current.y
      const speed = Math.hypot(vx, vy)
      const angle = Math.atan2(vy, vx)
      const stretchX = 1 + Math.min(speed * 0.055, 0.65)
      const stretchY = 1 / stretchX

      const dotScale =
        mode === 'pressed'       ? 0.42
        : mode === 'text'        ? 0.18
        : mode === 'interactive' ? 1.45
        : 1

      const ringScale =
        mode === 'pressed'       ? 0.7
        : mode === 'text'        ? 1.7
        : mode === 'interactive' ? 1.6
        : 1

      const ringBorderRadius =
        mode === 'text' ? '3px' : '50%'

      const accent = accentRef.current

      if (dotRef.current) {
        const el  = dotRef.current
        const opq = vis ? 1 : 0
        el.style.opacity   = opq
        el.style.transform = `
          translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)
          translate(-50%, -50%)
          rotate(${angle}rad)
          scaleX(${stretchX * dotScale})
          scaleY(${stretchY * dotScale})
        `
        el.style.background = accent && mode === 'interactive'
          ? accent
          : mode === 'pressed' ? 'var(--cursor-dot-pressed)'
          : mode === 'text'    ? 'var(--cursor-dot-text)'
          : 'var(--cursor-dot-default)'
        el.style.boxShadow = mode === 'interactive'
          ? `0 0 12px 3px ${accent || 'var(--cursor-shadow-default)'}`
          : mode === 'pressed'
          ? '0 0 14px 5px var(--cursor-shadow-pressed)'
          : '0 0 6px 1px var(--cursor-shadow-default)'
      }

      if (ringRef.current) {
        const el  = ringRef.current
        el.style.opacity      = vis ? 1 : 0
        el.style.transform    = `
          translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)
          translate(-50%, -50%)
          scale(${ringScale})
        `
        el.style.borderRadius = ringBorderRadius
        el.style.borderColor  = accent && mode === 'interactive'
          ? accent
          : mode === 'pressed'  ? 'var(--cursor-ring-pressed)'
          : mode === 'text'     ? 'var(--cursor-ring-text)'
          : 'var(--cursor-ring-default)'
        el.style.borderWidth = mode === 'interactive' || mode === 'pressed' ? '2px' : '1.5px'
      }

      if (glowRef.current) {
        const el  = glowRef.current
        const glowColor = accent && mode === 'interactive'
          ? accent.replace('rgb(', 'rgba(').replace(')', ', 0.15)')
          : 'var(--cursor-glow-default)'
        el.style.opacity = vis ? (mode === 'interactive' ? 1 : 0.55) : 0
        el.style.transform = `
          translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)
          translate(-50%, -50%)
          scale(${ringScale * 2.8})
        `
        el.style.background = `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.x    += p.vx
        p.y    += p.vy
        p.vx   *= 0.93
        p.vy   *= 0.93
        p.life -= p.decay

        if (p.life <= 0) {
          particles.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.life * 0.85
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)

        const col = p.color.startsWith('rgba')
          ? p.color
          : p.color.startsWith('rgb(')
            ? p.color.replace('rgb(', 'rgba(').replace(')', `, ${p.life})`)
            : p.color
        ctx.fillStyle = col
        ctx.shadowBlur  = 6
        ctx.shadowColor = col
        ctx.fill()
        ctx.restore()
      }

      velocity.current.x *= 0.72
      velocity.current.y *= 0.72

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    const root = document.documentElement
    window.addEventListener('pointermove',  onMove,  { passive: true })
    window.addEventListener('pointerdown',  onDown,  { passive: true })
    window.addEventListener('pointerup',    onUp,    { passive: true })
    root.addEventListener(  'pointerleave', onLeave, { passive: true })
    root.addEventListener(  'pointerenter', onEnter, { passive: true })
    window.addEventListener('blur', onBlur)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      document.body.classList.remove('has-custom-cursor')
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize',       resize)
      window.removeEventListener('pointermove',  onMove)
      window.removeEventListener('pointerdown',  onDown)
      window.removeEventListener('pointerup',    onUp)
      root.removeEventListener(  'pointerleave', onLeave)
      root.removeEventListener(  'pointerenter', onEnter)
      window.removeEventListener('blur', onBlur)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <style>{`
        .has-custom-cursor,
        .has-custom-cursor * { cursor: none !important; }

        
        .cc-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99996;
        }

        
        .cc-glow,
        .cc-ring,
        .cc-dot {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          will-change: transform, opacity;
          border-radius: 50%;
        }

        
        .cc-glow {
          width: 80px;
          height: 80px;
          z-index: 99997;
          opacity: 0;
          mix-blend-mode: var(--cursor-glow-blend, screen);
          transition: opacity 0.4s ease;
        }

        
        .cc-ring {
          width: 38px;
          height: 38px;
          border: 1.5px solid var(--cursor-ring-default);
          background: transparent;
          z-index: 99998;
          opacity: 0;
          transition:
            opacity 0.2s ease,
            border-color 0.3s ease,
            border-width 0.2s ease,
            border-radius 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }

        
        .cc-dot {
          width: 7px;
          height: 7px;
          background: var(--cursor-dot-default);
          z-index: 99999;
          opacity: 0;
          transition:
            opacity 0.18s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        
        @keyframes cc-ripple {
          0%   { box-shadow: 0 0 0 0px rgba(125,211,252,0.55); }
          100% { box-shadow: 0 0 0 22px rgba(125,211,252,0); }
        }
        .cc-dot.ripple { animation: cc-ripple 0.48s ease-out forwards; }
      `}</style>

      
      <canvas ref={canvasRef} className="cc-canvas" aria-hidden="true" />

      
      <div ref={glowRef} className="cc-glow" aria-hidden="true" />

      
      <div ref={ringRef} className="cc-ring" aria-hidden="true" />

      
      <div
        ref={dotRef}
        className="cc-dot"
        aria-hidden="true"
        onAnimationEnd={(e) => e.currentTarget.classList.remove('ripple')}
      />
    </>
  )
}
