'use client'
import useTheme from '@/hooks/useTheme'

import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export default function ApplyLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { theme, changeTheme } = useTheme()

  return (
    <div className="min-h-screen">
      {children}
      <div className="fixed right-4 top-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'dark' ? '🌒' : '☀️'}
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.error('Event has been created', {
              description: 'Sunday, December 03, 2023 at 9:00 AM',
              action: {
                label: 'Undo',
                onClick: () => console.log('Undo')
              }
            })
          }
        >
          🍞
        </Button>
      </div>
    </div>
  )
}
