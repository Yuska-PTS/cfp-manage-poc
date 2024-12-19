import { formItems } from '@/components/FormItem'
import { usePageContext } from './context'

export default function FormItemMenu() {
  const { addConfig } = usePageContext()

  return (
    <div className="'flex flex-col gap-2 overflow-y-auto border-r border-border/40 dark:border-border">
      <h1 className="mt-4 flex h-10 items-center px-4 text-xl">Components</h1>
      {Object.values(formItems).map((formItem) => {
        const { itemDisplayName, generateConfig } = formItem
        return (
          <div
            key={formItem.itemDisplayName}
            onClick={() => addConfig(generateConfig())}
            className="mt-2 cursor-pointer px-4 py-2 hover:bg-muted"
          >
            {itemDisplayName}
          </div>
        )
      })}
    </div>
  )
}
