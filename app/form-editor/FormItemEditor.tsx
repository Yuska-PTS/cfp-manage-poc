import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Reorder } from 'motion/react'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { formItems } from '@/components/FormItem'
import { FormItemConfig } from '@/components/FormItem/types'
import { Button } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import useBroadcast from '@/hooks/useBroadcast'
import { usePageContext } from './context'

let ConfigFormComp: FC<{
  config: FormItemConfig
  className?: string
  onSave: (config: FormItemConfig) => void
}> = () => null

export default function FormItemEditor() {
  const previewWin = useRef<Window | null>(null)
  const { configs, setConfigs, removeConfig, updateConfig } = usePageContext()
  const [formItemConfig, setFormItemConfig] = useState<FormItemConfig | null>(
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
      <div className="flex h-[100vh] flex-col border-r border-border/40 p-4 dark:border-border">
        <h1 className="flex items-center text-xl">
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
            className="relative mt-4 flex flex-col gap-2"
          >
            {configs.map((config) => {
              const ConfigForm = formItems[config.itemName].ConfigForm
              return (
                <Reorder.Item
                  key={config.id}
                  id={config.id}
                  value={config}
                  className="flex cursor-grab select-none items-center rounded-md border bg-background px-4 py-2 shadow-sm"
                >
                  <span className="mr-4 text-nowrap">{config.displayName}</span>
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
                      setFormItemConfig(config)
                    }}
                  >
                    <Pencil />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeConfig(config.id)
                      if (config.id === formItemConfig?.id) {
                        setFormItemConfig(null)
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
      {formItemConfig && (
        <ConfigFormComp
          className="h-[100vh]"
          key={formItemConfig.id}
          config={formItemConfig}
          onSave={updateConfig}
        />
      )}
    </div>
  )
}
