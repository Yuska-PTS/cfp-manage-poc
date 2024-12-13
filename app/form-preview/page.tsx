'use client'

import { formItems } from '@/components/FormItem'
import { FormItemConfig } from '@/components/FormItem/types'
import { Form } from '@/components/ui/Form'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useSearchParams } from 'next/navigation'

import useBroadcast from '@/hooks/useBroadcast'

export default function Preview() {
  const params = useSearchParams()
  const initConfigs = JSON.parse(
    params.get('configs') || '[]'
  ) as FormItemConfig[]
  const [configs, setConfigs] = useState<FormItemConfig[]>(initConfigs)

  const form = useForm()

  const { listen } = useBroadcast('preview-form')
  useEffect(() => {
    listen((configs) => {
      setConfigs(configs)
    })
  }, [listen])

  return (
    <div className="container m-auto">
      <ScrollArea className="flex-grow">
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
    </div>
  )
}
