import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form'

import { MarkdownToHtml } from '@/components/TextEditor'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
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
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {config.options.map((option) => (
                <FormItem
                  key={option}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option} />
                  </FormControl>
                  <FormLabel className="font-normal">{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
