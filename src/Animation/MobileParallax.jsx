import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

export default function MobileParallax({
  children,
  className = '',
  offset = 48,
  scale = 1.1,
}) {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')

    const updateMode = (event) => {
      setEnabled(event.matches)
    }

    setEnabled(mediaQuery.matches)

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMode)
      return () => mediaQuery.removeEventListener('change', updateMode)
    }

    mediaQuery.addListener(updateMode)
    return () => mediaQuery.removeListener(updateMode)
  }, [])

  const y = useTransform(scrollYProgress, [0, 1], [enabled ? offset : 0, enabled ? -offset : 0])
  const zoom = useTransform(
    scrollYProgress,
    [0, 1],
    [enabled ? scale : 1, enabled ? Math.max(1, scale - 0.08) : 1]
  )

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={reduceMotion || !enabled ? undefined : { y, scale: zoom }}
    >
      {children}
    </motion.div>
  )
}

MobileParallax.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  offset: PropTypes.number,
  scale: PropTypes.number,
}
