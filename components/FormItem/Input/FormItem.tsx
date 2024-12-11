import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormNote
} from '@/components/ui/Form'

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
          <FormLabel>{config.label}</FormLabel>
          {/* TODO markdown transform */}
          {config.description && (
            <FormDescription className="prose">
              {config.description}
            </FormDescription>
          )}
          <FormControl>
            <Input placeholder={config.placeholder} {...field} />
          </FormControl>
          {config.note && <FormNote className="prose">{config.note}</FormNote>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
