import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import SaveButton from '../SaveButton'

type Props = {
  status?: 'idle' | 'loading' | 'error' | 'success'
  title?: string
  description?: string
  children: ReactNode
  onSave: () => void
}

export default function SettingDialog({
  status = 'idle',
  title = '欄位設定',
  description,
  onSave,
  children
}: Props) {
  function onSaveClick() {
    onSave()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pencil className="ml-auto size-8 cursor-pointer overflow-visible rounded-full p-2 hover:bg-muted" />
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="baseConfig">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="baseConfig">基本設定</TabsTrigger>
            <TabsTrigger value="conditionConfig">條件設定</TabsTrigger>
          </TabsList>
          <TabsContent value="baseConfig">{children}</TabsContent>
          <TabsContent value="conditionConfig"></TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              關閉
            </Button>
          </DialogClose>
          <SaveButton onClick={onSaveClick} status={status} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
