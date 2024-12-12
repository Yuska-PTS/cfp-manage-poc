import { Check, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from './ui/Button'

type Props = {
  status?: 'idle' | 'loading' | 'error' | 'success'
  disabled?: boolean
  className?: string
  onClick: () => void
}

export default function SaveButton({
  status = 'idle',
  disabled = false,
  className,
  onClick
}: Props) {
  const [isIconVisible, setIsIconVisible] = useState(true)

  useEffect(() => {
    if (status === 'idle') {
      setIsIconVisible(false)
    } else {
      setIsIconVisible(true)
    }

    let timeoutId: NodeJS.Timeout
    if (status === 'success') {
      timeoutId = setTimeout(() => {
        setIsIconVisible(false)
      }, 2000)
    }

    return () => clearTimeout(timeoutId)
  }, [status])

  return (
    <Button
      className={className}
      disabled={disabled || status === 'loading'}
      onClick={onClick}
    >
      <AnimatePresence>
        {isIconVisible && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ duration: 0.1, ease: 'linear' }}
            exit={{ opacity: 0, width: 0 }}
          >
            {status === 'loading' && <Loader2 className="animate-spin" />}
            {status === 'success' && <Check />}
          </motion.div>
        )}
      </AnimatePresence>
      儲存
    </Button>
  )
}
