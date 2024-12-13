import { Button } from '@/components/ui/Button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/Sheet'
import { Pencil } from 'lucide-react'
import { ReactNode, useState } from 'react'
import SaveButton from '../SaveButton'

type Props = {
  status?: 'idle' | 'loading' | 'error' | 'success'
  title?: string
  description?: string
  children: ReactNode
  onSave: () => Promise<boolean>
}

export default function BaseConfigSheet({
  status = 'idle',
  title = '欄位設定',
  description,
  onSave,
  children
}: Props) {
  const [open, setOpen] = useState(false)

  async function onSaveClick() {
    const open = await onSave()
    setOpen(open)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Pencil className="ml-auto size-8 cursor-pointer overflow-visible rounded-full p-2 hover:bg-muted" />
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-4">{children}</div>

        <SheetFooter className="border-t p-4 dark:border-border">
          <SheetClose asChild>
            <Button type="button" variant="secondary">
              關閉
            </Button>
          </SheetClose>
          <SaveButton onClick={onSaveClick} status={status} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
