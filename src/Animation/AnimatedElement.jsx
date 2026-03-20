import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const transformByDirection = {
  up: (distance) => `translateY(${distance}px)`,
  down: (distance) => `translateY(-${distance}px)`,
  left: (distance) => `translateX(${distance}px)`,
  right: (distance) => `translateX(-${distance}px)`,
  'up-left': (distance) => `translate(${distance}px, ${distance}px)`,
  'up-right': (distance) => `translate(-${distance}px, ${distance}px)`,
  'down-left': (distance) => `translate(${distance}px, -${distance}px)`,
  'down-right': (distance) => `translate(-${distance}px, -${distance}px)`,
}

function AnimatedElement({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  distance = 12,
  once = true,
  easing = 'ease-out',
  threshold = 0.1,
  className = '',
  startVisible = false,
  triggerOnce = true,
}) {
  const [isVisible, setIsVisible] = useState(startVisible)
  const elementRef = useRef(null)

  useEffect(() => {
    if (startVisible) {
      return undefined
    }

    const shouldTriggerOnce = once && triggerOnce
    let timeoutId

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = window.setTimeout(() => {
            setIsVisible(true)
          }, delay)

          if (shouldTriggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current)
          }
        } else if (!shouldTriggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    )

    const currentElement = elementRef.current

    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }

      if (currentElement) {
        observer.unobserve(currentElement)
      }

      observer.disconnect()
    }
  }, [delay, once, startVisible, threshold, triggerOnce])

  const transform =
    isVisible || !transformByDirection[direction]
      ? 'translate(0, 0)'
      : transformByDirection[direction](distance)

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform,
        transition: `all ${duration}ms ${easing}`,
      }}
    >
      {children}
    </div>
  )
}

AnimatedElement.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number,
  direction: PropTypes.oneOf([
    'up',
    'down',
    'left',
    'right',
    'up-left',
    'up-right',
    'down-left',
    'down-right',
  ]),
  distance: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.string,
  once: PropTypes.bool,
  startVisible: PropTypes.bool,
  threshold: PropTypes.number,
  triggerOnce: PropTypes.bool,
}

export default AnimatedElement
