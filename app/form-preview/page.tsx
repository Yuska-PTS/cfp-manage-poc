'use client'

import {
  formItems,
  generateDefaultValues,
  generateZodSchema
} from '@/components/FormItem'
import { FormItemConfigMap, FormItemConfigUnion } from '@/components/FormItem/types'
import SaveButton from '@/components/SaveButton'
import { Form } from '@/components/ui/Form'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Separator } from '@/components/ui/Separator'
import useBroadcast from '@/hooks/useBroadcast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Preview() {
  const [status] = useState<'idle' | 'loading' | 'success'>('idle')
  const params = useSearchParams()
  const [configs, setConfigs] = useState<FormItemConfigUnion[]>(() => {
    const configsQuery = params.get('configs') || '[]'
    return JSON.parse(configsQuery) as FormItemConfigUnion[]
  })

  const form = useForm({
    resolver: (values, context, options) => {
      const formSchema = generateZodSchema(configs)
      const createResolver = zodResolver(formSchema)
      return createResolver(values, context, options)
    },
    defaultValues: generateDefaultValues(configs)
  })

  useEffect(() => {
    const defaultValues = generateDefaultValues(configs)
    form.reset(defaultValues)
  }, [configs, form])

  const { listen } = useBroadcast('preview-form')
  useEffect(() => {
    listen((configs) => {
      setConfigs(configs)
      window.history.replaceState(
        { ...window.history.state },
        '',
        '/form-preview?configs=' + encodeURIComponent(JSON.stringify(configs))
      )
    })
  }, [listen])

  async function submit() {
    await form.handleSubmit(() => {})()
    console.log(form.getValues())
    console.log(form.formState)
    return open
  }

  return (
    <div className="container m-auto flex h-screen flex-col">
      <ScrollArea>
        <div className="p-4">
          <Form {...form}>
            <form className="mt-4 grid grid-cols-12 gap-4">
              {configs.map(<T extends keyof FormItemConfigMap>(config: FormItemConfigUnion<T>) => {
                const FormItem = formItems[config.itemName].FormItem
                return (
                  <FormItem
                    form={form}
                    key={config.id}
                    config={config}
                  />
                )
              })}
            </form>
          </Form>
        </div>
      </ScrollArea>
      <Separator />
      <div className="flex justify-center p-4">
        <SaveButton status={status} onClick={submit} />
      </div>
    </div>
  )
}
