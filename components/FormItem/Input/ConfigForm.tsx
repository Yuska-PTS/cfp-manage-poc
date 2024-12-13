import TextEditor from '@/components/TextEditor'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { Config } from './index'
import { configSchema, displayName } from './index'

import { useState } from 'react'
import ConfigFormWrap from '../ConfigFormWrap'

type Props = {
  className?: string
  config: Config
  onSave: (config: Config) => void
}

export default function ConfigForm({ config, onSave, className }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const form = useForm<Config>({
    resolver: zodResolver(configSchema),
    defaultValues: { ...config }
  })

  async function submit() {
    await form.handleSubmit((data) => {
      onSave(data)
      setStatus('success')
      return false
    })()
    console.log(form.getValues())
    console.log(form.formState)
    return open
  }

  return (
    <ConfigFormWrap
      title={displayName}
      status={status}
      onSave={submit}
      className={className}
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>欄位標題</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <TextEditor
                    editable
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>備註</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="placeholder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>預設文字</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unique"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-4 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>欄位值不重複</FormLabel>
                  <FormDescription>
                    勾選後會跟後端確認是否有其他人有相同的值，有的話會提示錯誤且無法提交。適合用在身分證字號、email等不能重複的資料欄位。
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unique"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-4 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>欄位值不重複</FormLabel>
                  <FormDescription>
                    勾選後會跟後端確認是否有其他人有相同的值，有的話會提示錯誤且無法提交。適合用在身分證字號、email等不能重複的資料欄位。
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </ConfigFormWrap>
  )
}
