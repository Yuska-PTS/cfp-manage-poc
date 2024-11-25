import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function updateDom(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>()

  // initial theme value
  // since only client side can access document, so put it inside useEffect
  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'

    setTheme(currentTheme)
  }, [])

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')

    function listener({ matches: isDark }: Pick<MediaQueryList, 'matches'>) {
      // already have prefered theme
      if (localStorage.getItem('theme')) {
        return
      }
      updateDom(isDark)
      setTheme(isDark ? 'dark' : 'light')
    }

    matchMedia.addEventListener('change', listener)

    return () => matchMedia.removeEventListener('change', listener)
  }, [])

  function changeTheme(value: Theme) {
    updateDom(value === 'dark')
    localStorage.setItem('theme', value)
    setTheme(value)
  }

  return { theme, changeTheme }
}
