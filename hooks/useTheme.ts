import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function updateDom(theme: Theme) {
  const classList = document.documentElement.classList

  switch (theme) {
    case 'dark':
      classList.remove('light')
      classList.add('dark')
      break

    case 'light':
      classList.remove('dark')
      classList.add('light')
      break

    case 'system':
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      classList.remove('light', 'dark')
      classList.add(systemTheme)
      break
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>()

  // sync theme value from localStorage
  // since only client side can access document, so put it inside useEffect
  useEffect(() => {
    const theme = localStorage.getItem(STORAGE_KEY) as Theme
    setTheme(theme)
  }, [])

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')

    function listener() {
      const preferedTheme = localStorage.getItem(STORAGE_KEY) as Theme
      // preferedTheme === 'system' means user prefer change theme with system configuration.
      // When this listener is triggered, it means system theme has changed, so here we call
      // updateDom() to update the theme.
      if (preferedTheme === 'system') {
        updateDom(preferedTheme)
      }
    }

    matchMedia.addEventListener('change', listener)

    return () => matchMedia.removeEventListener('change', listener)
  }, [])

  function changeTheme(value: Theme) {
    updateDom(value)
    localStorage.setItem(STORAGE_KEY, value)
    setTheme(value)
  }

  function refresh() {
    const theme = localStorage.getItem(STORAGE_KEY) as Theme
    setTheme(theme)
    updateDom(theme)
  }

  return { theme, changeTheme, refresh }
}
