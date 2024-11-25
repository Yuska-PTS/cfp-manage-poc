'use client'

import { Button } from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import { Toggle } from '@/components/ui/Toggle'
import useTheme from '@/hooks/useTheme'
import { toast } from 'sonner'

export default function SonnerDemo() {
  const { theme, changeTheme } = useTheme()

  return (
    <div>
      <Toggle
        aria-label="Toggle italic"
        onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme}
      </Toggle>
      <DatePicker />
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo')
            }
          })
        }
      >
        Show Toast
      </Button>
    </div>
  )
}
