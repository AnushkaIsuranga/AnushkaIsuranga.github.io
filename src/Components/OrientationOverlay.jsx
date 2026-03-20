import PropTypes from 'prop-types'

function OrientationOverlay({ isVisible }) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="orientation-overlay-container">
      <div className="orientation-overlay-backdrop" />
      <div className="orientation-overlay-content">
        <div className="orientation-icon">📱</div>
        <h1 className="orientation-title">Keep Portrait Mode</h1>
        <p className="orientation-message">
          Please rotate your device to portrait orientation for the best viewing experience.
        </p>
      </div>
    </div>
  )
}

OrientationOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
}

export default OrientationOverlay
