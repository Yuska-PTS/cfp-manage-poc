import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormNote
} from '@/components/ui/Form'

import { MarkdownToHtml } from '@/components/TextEditor'
import { Input } from '@/components/ui/Input'
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

          <FormControl>
            <Input
              type={config.validation === 'email' ? 'email' : 'text'}
              placeholder={config.placeholder}
              {...field}
              disabled={config.disabled}
            />
          </FormControl>

          {config.note && <FormNote className="prose">{config.note}</FormNote>}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
