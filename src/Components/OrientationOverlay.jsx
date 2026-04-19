import { useEffect } from 'react'
import PropTypes from 'prop-types'

function OrientationOverlay({ isVisible }) {
  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const { documentElement, body } = document
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverscroll = documentElement.style.overscrollBehavior
    const previousBodyOverscroll = body.style.overscrollBehavior

    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    documentElement.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'

    return () => {
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overflow = previousBodyOverflow
      documentElement.style.overscrollBehavior = previousHtmlOverscroll
      body.style.overscrollBehavior = previousBodyOverscroll
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className="orientation-overlay-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="orientation-overlay-title"
      aria-describedby="orientation-overlay-description"
    >
      <div className="orientation-overlay-backdrop" />
      <div className="orientation-overlay-grid" aria-hidden="true" />
      <div className="orientation-overlay-glow orientation-overlay-glow-one" aria-hidden="true" />
      <div className="orientation-overlay-glow orientation-overlay-glow-two" aria-hidden="true" />

      <div className="orientation-overlay-content">
        <div className="orientation-overlay-panel">
          <div className="orientation-overlay-inner">
            <div className="orientation-overlay-symbol" aria-hidden="true">
              <span>Rotate</span>
            </div>

            <div className="orientation-overlay-copy">
              <h1 id="orientation-overlay-title" className="orientation-title">
                Rotate your device
              </h1>
              <p id="orientation-overlay-description" className="orientation-message">
                Please use portrait mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OrientationOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default OrientationOverlay
