'use client'

import { Toggle } from '@/components/ui/Toggle'
import useBroadcast from '@/hooks/useBroadcast'
import useTheme, { Theme } from '@/hooks/useTheme'
import { MonitorCog, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'

export default function ThemeSelector() {
  const { theme, changeTheme, refresh } = useTheme()
  const { send, listen } = useBroadcast('theme')

  useEffect(() => {
    listen(() => refresh())
  }, [listen, refresh])

  function handleClick(theme: Theme) {
    changeTheme(theme)
    send(theme)
  }

  return (
    <div className="fixed right-4 top-4 flex items-center gap-1 rounded-l-full rounded-r-full border shadow-sm backdrop-blur-md">
      <Toggle
        size="sm"
        className="rounded-full data-[state=on]:text-lime-500"
        pressed={theme === 'light'}
        onClick={() => handleClick('light')}
      >
        <Sun />
      </Toggle>

      <Toggle
        size="sm"
        className="rounded-full data-[state=on]:text-lime-500"
        pressed={theme === 'system'}
        onClick={() => handleClick('system')}
      >
        <MonitorCog />
      </Toggle>

      <Toggle
        size="sm"
        className="rounded-full data-[state=on]:text-lime-500"
        pressed={theme === 'dark'}
        onClick={() => handleClick('dark')}
      >
        <Moon />
      </Toggle>
    </div>
  )
}
