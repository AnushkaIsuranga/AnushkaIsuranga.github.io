export const THEME_STORAGE_KEY = 'portfolio-theme'

export function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' ? 'light' : 'dark'
}
