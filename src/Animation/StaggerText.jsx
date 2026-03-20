import PropTypes from 'prop-types'
import { motion, useReducedMotion } from 'motion/react'

const parentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const childVariants = {
  hidden: {
    opacity: 0,
    y: '0.8em',
  },
  visible: {
    opacity: 1,
    y: '0em',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function StaggerText({
  text,
  className = '',
  charClassName = '',
  once = true,
  amount = 0.45,
  split = 'words',
}) {
  const reduceMotion = useReducedMotion()
  const segments = split === 'chars' ? Array.from(text) : text.split(' ')

  if (reduceMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <motion.span
      className={className}
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      aria-label={text}
    >
      {segments.map((segment, index) => (
        <span key={`${segment}-${index}`} className="inline-block overflow-hidden align-top">
          <motion.span
            className={charClassName || "inline-block will-change-transform"}
            variants={childVariants}
            aria-hidden="true"
          >
            {segment === ' ' ? '\u00A0' : segment}
            {split === 'words' && index < segments.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

StaggerText.propTypes = {
  amount: PropTypes.number,
  className: PropTypes.string,
  charClassName: PropTypes.string,
  once: PropTypes.bool,
  split: PropTypes.oneOf(['words', 'chars']),
  text: PropTypes.string.isRequired,
}
