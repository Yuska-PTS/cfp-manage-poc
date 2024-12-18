import {
  generateConfig as generateInputConfig,
  itemDisplayName,
  itemName
} from '@/components/FormItem/TextInput/index'

import { usePageContext } from './context'

const formItems = [
  {
    itemName,
    itemDisplayName,
    generator: generateInputConfig
  }
]

export default function FormItemMenu() {
  const { addConfig } = usePageContext()

  return (
    <div className="'flex flex-col gap-2 overflow-y-auto border-r border-border/40 dark:border-border">
      <h1 className="mt-4 px-4 text-xl">Components</h1>
      {formItems.map(({ itemName, itemDisplayName, generator }) => {
        return (
          <div
            key={itemName}
            onClick={() => addConfig(generator())}
            className="mt-2 cursor-pointer px-4 py-2 hover:bg-muted"
          >
            {itemDisplayName}
          </div>
        )
      })}
    </div>
  )
}
