import TagInput from '@/components/TagInput'
import TextEditor from '@/components/TextEditor'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ConfigFormWrap from '../ConfigFormWrap'
import type { Config } from './index'
import { configSchema, itemDisplayName } from './index'

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
    setStatus('loading')
    await form.handleSubmit((data) => {
      onSave(data)
    })()
    setStatus('success')
    console.log(form.getValues())
    return open
  }

  return (
    <ConfigFormWrap
      title={itemDisplayName}
      status={status}
      onSave={submit}
      className={className}
    >
      <Form {...form}>
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="col-span-12">
                <FormLabel>標題</FormLabel>
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
              <FormItem className="col-span-12">
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
              <FormItem className="col-span-12">
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
              <FormItem className="col-span-12">
                <FormLabel>提示文字</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem className="col-span-12">
                <FormLabel>選項</FormLabel>
                <FormControl>
                  <TagInput {...field} placeholder="輸入文字後按 Enter 新增" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-row items-start gap-4 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>必填</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="replaceable"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-row items-start gap-4 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>可補件</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="committeeVisible"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-row items-start gap-4 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>顯示給評審看</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-row items-start gap-4 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>唯讀</FormLabel>
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
