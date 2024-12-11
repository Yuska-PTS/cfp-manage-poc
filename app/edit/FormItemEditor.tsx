import { formItems } from '@/components/FormItem'
import { Trash2 } from 'lucide-react'
import { Reorder } from 'motion/react'
import { usePageContext } from './context'

export default function FormItemEditor() {
  const { configs, setConfigs, removeConfig, addConfig, updateConfig } =
    usePageContext()

  return (
    <div className="overflow-y-auto border-r border-border/40 p-4 dark:border-border">
      <h1 className="text-xl">Edit form</h1>
      <Reorder.Group
        axis="y"
        values={configs}
        onReorder={setConfigs}
        className="relative mt-4 flex flex-col gap-2"
      >
        {configs.map((config) => {
          const ConfigDialog = formItems[config.itemName].ConfigDialog
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

              <ConfigDialog config={config} onSave={updateConfig} />
              <Trash2
                onClick={() => removeConfig(config.id)}
                className="ml-2 size-8 cursor-pointer overflow-visible rounded-full p-2 hover:bg-muted"
              />
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </div>
  )
}
