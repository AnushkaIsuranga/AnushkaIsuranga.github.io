import PropTypes from 'prop-types'
import { motion, useReducedMotion } from 'motion/react'

const axisByDirection = {
  up: { y: 48, x: 0 },
  down: { y: -48, x: 0 },
  left: { y: 0, x: 48 },
  right: { y: 0, x: -48 },
}

export default function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  once = true,
  amount = 0.25,
  duration = 0.85,
}) {
  const reduceMotion = useReducedMotion()
  const axis = axisByDirection[direction] || axisByDirection.up

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, y: axis.y, x: axis.x }
      }
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

Reveal.propTypes = {
  amount: PropTypes.number,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  duration: PropTypes.number,
  once: PropTypes.bool,
}
