import { useEffect, useState } from 'react'

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })

const readBootProgress = () => {
  if (typeof window === 'undefined') {
    return 0
  }

  return window.__portfolioBootLoader?.getProgress?.() ?? 0
}

const waitForWindowLoad = () =>
  new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve()
      return
    }

    window.addEventListener('load', resolve, { once: true })
  })

const waitForFonts = () => {
  if (document.fonts && 'ready' in document.fonts) {
    return document.fonts.ready.catch(() => undefined)
  }

  return Promise.resolve()
}

const preloadImage = (source) =>
  new Promise((resolve) => {
    if (!source) {
      resolve()
      return
    }

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = source

    if (image.complete) {
      resolve()
    }
  })

const withTimeout = (task, timeoutMs) => Promise.race([task, wait(timeoutMs)])

export function useProgressLoader(options = {}) {
  const { assetUrls = [], minDurationMs = 5000, maxTaskMs = 1800 } = options

  const [progress, setProgress] = useState(() => readBootProgress())
  const [status, setStatus] = useState('Loading shell')
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    let cancelled = false
    const startedAt = window.performance.now()

    const tasks = [
      {
        label: 'Loading shell',
        progress: 34,
        run: () => withTimeout(waitForWindowLoad(), maxTaskMs),
      },
      {
        label: 'Loading typography',
        progress: 62,
        run: () => withTimeout(waitForFonts(), maxTaskMs),
      },
      {
        label: 'Loading media',
        progress: 90,
        run: () => Promise.allSettled(assetUrls.map(preloadImage)),
      },
    ]

    const syncBootLoader = (nextProgress, nextStatus) => {
      window.__portfolioBootLoader?.setProgress?.(nextProgress)
      window.__portfolioBootLoader?.setStatus?.(nextStatus)
    }

    const finish = async () => {
      const elapsed = window.performance.now() - startedAt

      if (elapsed < minDurationMs) {
        await wait(minDurationMs - elapsed)
      }

      if (cancelled) {
        return
      }

      setStatus('Ready')
      setProgress(100)
      syncBootLoader(100, 'Ready')
      setComplete(true)
    }

    const runLoader = async () => {
      for (const task of tasks) {
        if (cancelled) {
          return
        }

        const currentProgress = readBootProgress()

        if (currentProgress < task.progress) {
          setStatus(task.label)
          syncBootLoader(currentProgress, task.label)
        }

        await task.run()

        if (cancelled) {
          return
        }

        setProgress((current) => {
          const nextValue = Math.max(current, task.progress)
          syncBootLoader(nextValue, task.label)
          return nextValue
        })
      }

      await finish()
    }

    runLoader()

    return () => {
      cancelled = true
    }
  }, [assetUrls, maxTaskMs, minDurationMs])

  return {
    complete,
    progress,
    status,
  }
}
