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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select'
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
  console.log('config', config)
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
    console.log(form.formState)
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
            name="maxLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最大長度</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>格式驗證</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">無</SelectItem>
                    <SelectItem value="email">email</SelectItem>
                    <SelectItem value="idNo">身分證字號</SelectItem>
                    <SelectItem value="gui">統一編號</SelectItem>
                    <SelectItem value="youtubeUrl">Youtube URL</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
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
              <FormItem className="flex flex-row items-start gap-4 space-y-0 px-1">
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
              <FormItem className="flex flex-row items-start gap-4 space-y-0 px-1">
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
              <FormItem className="flex flex-row items-start gap-4 space-y-0 px-1">
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
                  <FormLabel>值不重複</FormLabel>
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
