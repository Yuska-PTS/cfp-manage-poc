import { formItems } from '@/components/FormItem'
import { Form } from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import { usePageContext } from './context'

export default function Preview() {
  const { configs } = usePageContext()
  const form = useForm()
  return (
    <div className="overflow-y-auto p-4">
      <h1 className="text-xl">Priview form</h1>
      <Form {...form}>
        <form className="mt-4 grid grid-cols-12 gap-4">
          {configs.map((config) => {
            const FormItem = formItems[config.itemName].FormItem
            return <FormItem form={form} key={config.id} config={config} />
          })}
        </form>
      </Form>
    </div>
  )
}
