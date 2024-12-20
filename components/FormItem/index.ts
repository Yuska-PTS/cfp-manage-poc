import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import * as SelectFormItem from './Select'
import * as InputFormItem from './TextInput'
import * as TextareaFormItem from './Textarea'
import type { FormItemConfigMap, FormItemConfigUnion } from './types'

export type FormItemMap = {
  [key in keyof FormItemConfigMap]: {
    itemName: key
    itemDisplayName: string
    configSchema: z.ZodObject<z.ZodRawShape>
    ConfigForm: FC<{
      config: FormItemConfigUnion<key>
      className?: string
      onSave: (config: FormItemConfigUnion<key>) => void
    }>
    FormItem: FC<{
      form: UseFormReturn
      config: FormItemConfigUnion<key>
    }>
    generateConfig(): FormItemConfigUnion<key>
    generateZodSchema(config: FormItemConfigUnion<key>): z.ZodTypeAny
    generateDefaultValue(): unknown
  }
}

export const formItems: FormItemMap = {
  [InputFormItem.itemName]: InputFormItem,
  [TextareaFormItem.itemName]: TextareaFormItem,
  [SelectFormItem.itemName]: SelectFormItem
} as const

export function generateZodSchema<T extends keyof FormItemConfigMap>(
  configs: FormItemConfigUnion<T>[]
) {
  const schemaObject: Record<string, z.ZodTypeAny> = {}
  configs.forEach((config) => {
    const schema = formItems[config.itemName].generateZodSchema(config)
    schemaObject[config.id] = schema
  })

  return z.object(schemaObject)
}
export function generateDefaultValues<T extends keyof FormItemConfigMap>(
  configs: FormItemConfigUnion<T>[]
) {
  const defaultValues: Record<string, unknown> = {}
  configs.forEach((config) => {
    defaultValues[config.id] = formItems[config.itemName].generateDefaultValue()
  })
  return defaultValues
}
