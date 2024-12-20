import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormNote
} from '@/components/ui/Form'

import { MarkdownToHtml } from '@/components/TextEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select'
import type { UseFormReturn } from 'react-hook-form'
import type { Config } from './index'

type Props = {
  form: UseFormReturn
  config: Config
}

export default function FormInput({ form, config }: Props) {
  return (
    <FormField
      control={form.control}
      name={config.id}
      render={({ field }) => (
        <FormItem className="col-span-12">
          <FormLabel>
            <span>{config.label}</span>
            {config.required && config.label && (
              <span className="ml-1 font-bold text-red-500">*</span>
            )}
          </FormLabel>

          {config.description && <MarkdownToHtml value={config.description} />}

          <Select
            disabled={config.disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={config.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {config.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {config.note && <FormNote className="prose">{config.note}</FormNote>}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
