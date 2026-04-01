import PropTypes from 'prop-types'

function OrientationOverlay({ isVisible }) {
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
            <div className="orientation-overlay-header">
              <span className="eyebrow-chip">Mobile layout</span>
              <span className="metric-label text-[#7dd3fc]">Portrait recommended</span>
            </div>

            <div className="orientation-overlay-visual" aria-hidden="true">
              <div className="orientation-device-stage">
                <div className="orientation-rotation-ring" />

                <div className="orientation-device orientation-device-landscape">
                  <span className="orientation-device-camera" />
                  <div className="orientation-device-screen">
                    <span className="orientation-device-chip" />
                    <span className="orientation-device-bar orientation-device-bar-primary" />
                    <span className="orientation-device-bar orientation-device-bar-wide" />
                    <span className="orientation-device-bar" />
                    <div className="orientation-device-row">
                      <span className="orientation-device-tile" />
                      <span className="orientation-device-tile" />
                    </div>
                  </div>
                </div>

                <div className="orientation-device orientation-device-portrait">
                  <span className="orientation-device-camera" />
                  <div className="orientation-device-screen">
                    <span className="orientation-device-chip" />
                    <span className="orientation-device-bar orientation-device-bar-primary" />
                    <span className="orientation-device-bar orientation-device-bar-wide" />
                    <span className="orientation-device-bar" />
                    <div className="orientation-device-stack">
                      <span className="orientation-device-card" />
                      <span className="orientation-device-card orientation-device-card-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="orientation-overlay-copy">
              <h1 id="orientation-overlay-title" className="orientation-title">
                Rotate back to portrait
              </h1>
              <p id="orientation-overlay-description" className="orientation-message">
                This portfolio is tuned for vertical browsing so the spacing, section flow, and
                motion stay clear and intentional.
              </p>
            </div>

            <div className="orientation-overlay-benefits">
              <div className="surface-muted orientation-overlay-benefit">
                <span className="orientation-overlay-benefit-dot" />
                Cleaner section rhythm
              </div>
              <div className="surface-muted orientation-overlay-benefit">
                <span className="orientation-overlay-benefit-dot" />
                Better motion balance
              </div>
            </div>

            <p className="orientation-overlay-note">
              The full experience returns automatically once the device is upright again.
            </p>
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
