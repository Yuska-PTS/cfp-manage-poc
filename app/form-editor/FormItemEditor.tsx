import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Reorder } from 'motion/react'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { formItems } from '@/components/FormItem'
import { FormItemConfig } from '@/components/FormItem/types'
import { Button } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import useBroadcast from '@/hooks/useBroadcast'
import { cn } from '@/lib/utils'
import { usePageContext } from './context'

let ConfigFormComp: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
  className?: string
  onSave: (config: FormItemConfig) => void
}> = () => null

export default function FormItemEditor() {
  const previewWin = useRef<Window | null>(null)
  const { configs, setConfigs, removeConfig, updateConfig } = usePageContext()
  const [selectedConfig, setSelectedConfig] = useState<FormItemConfig | null>(
    null
  )

  const { send } = useBroadcast('preview-form')

  useEffect(() => {
    send(configs)
  }, [configs, send])

  function openPreviewWindow() {
    const win = previewWin.current
    if (win && win.opener && !win.opener.closed) {
      win.focus()
      return
    }
    const configsParam = encodeURIComponent(JSON.stringify(configs))
    previewWin.current = window.open(
      '/form-preview?configs=' + configsParam,
      '_blank'
    )
  }

  return (
    <div className="grid grid-cols-[1fr_1fr]">
      <div className="flex h-[100vh] flex-col border-r border-border/40 dark:border-border">
        <h1 className="flex items-center p-4 text-xl">
          <span>Edit form</span>
          <Button
            className="ml-auto"
            variant="ghost"
            size="icon"
            aria-label="預覽"
            onClick={openPreviewWindow}
          >
            <Eye />
          </Button>
        </h1>
        <ScrollArea className="flex-grow">
          <Reorder.Group
            axis="y"
            values={configs}
            onReorder={setConfigs}
            className="relative flex flex-col gap-2"
          >
            {configs.map((config) => {
              const ConfigForm = formItems[config.itemName].ConfigForm
              return (
                <Reorder.Item
                  key={config.id}
                  id={config.id}
                  value={config}
                  className={cn(
                    'mx-4 flex cursor-grab select-none items-center rounded-md border bg-background px-4 py-2 shadow-sm',
                    selectedConfig?.id === config.id &&
                      'border-lime-500 shadow-lime-500'
                  )}
                >
                  <span className="mr-4 text-nowrap">
                    {config.itemDisplayName}
                  </span>
                  {config.label && (
                    <span className="mr-4 truncate">{config.label}</span>
                  )}

                  <Button
                    className="ml-auto"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      ConfigFormComp = ConfigForm
                      console.log(config)
                      setSelectedConfig(config)
                    }}
                  >
                    <Pencil />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeConfig(config.id)
                      if (config.id === selectedConfig?.id) {
                        setSelectedConfig(null)
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </ScrollArea>
      </div>
      {selectedConfig && (
        <ConfigFormComp
          className="h-[100vh]"
          key={selectedConfig.id}
          config={selectedConfig}
          onSave={updateConfig}
        />
      )}
    </div>
  )
}
