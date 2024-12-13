import { ScrollArea } from '@/components/ui/ScrollArea'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import SaveButton from '../SaveButton'

type Props = {
  status?: 'idle' | 'loading' | 'error' | 'success'
  title?: string
  description?: string
  children: ReactNode
  className?: string
  onSave: () => Promise<unknown>
}

export default function ConfigFormWrap({
  status = 'idle',
  title = '欄位設定',
  onSave,
  className,
  children
}: Props) {
  async function onSaveClick() {
    onSave()
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="p-4">
        <h2 className="text-lg font-bold">{title}設定</h2>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">{children}</div>
      </ScrollArea>
      <div className="border-t p-4 dark:border-border">
        <SaveButton onClick={onSaveClick} status={status} />
      </div>
    </div>
  )
}
