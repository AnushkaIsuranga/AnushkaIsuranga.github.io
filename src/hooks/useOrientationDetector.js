import { useEffect, useState } from 'react'

export function useOrientationDetector() {
  const [isLandscape, setIsLandscape] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    // Detect if device is mobile
    const checkMobileDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      setIsMobileDevice(isMobile)
    }

    // Check orientation
    const checkOrientation = () => {
      const landscape = window.matchMedia('(orientation: landscape)').matches
      setIsLandscape(landscape)
    }

    checkMobileDevice()
    checkOrientation()

    // Listen for orientation changes
    const mediaQueryList = window.matchMedia('(orientation: landscape)')
    const handleOrientationChange = () => checkOrientation()
    mediaQueryList.addEventListener('change', handleOrientationChange)

    // Also listen to resize events as backup
    window.addEventListener('resize', checkOrientation)

    return () => {
      mediaQueryList.removeEventListener('change', handleOrientationChange)
      window.removeEventListener('resize', checkOrientation)
    }
  }, [])

  return { isLandscape, isMobileDevice, shouldShowOverlay: isLandscape && isMobileDevice }
}
