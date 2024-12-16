'use client'

import { formItems } from '@/components/FormItem'
import { FormItemConfig } from '@/components/FormItem/types'
import SaveButton from '@/components/SaveButton'
import { Form } from '@/components/ui/Form'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Separator } from '@/components/ui/Separator'
import useBroadcast from '@/hooks/useBroadcast'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Preview() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const params = useSearchParams()
  const [configs, setConfigs] = useState<FormItemConfig[]>(() => {
    const configsQuery = params.get('configs') || '[]'
    return JSON.parse(configsQuery) as FormItemConfig[]
  })

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

  const form = useForm()

  async function submit() {
    setStatus('loading')
    await form.handleSubmit(() => {
      setStatus('success')
    })()
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
              {configs.map((config) => {
                const FormItem = formItems[config.itemName].FormItem
                return <FormItem form={form} key={config.id} config={config} />
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
