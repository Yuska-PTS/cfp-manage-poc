import { z } from 'zod'
import * as InputFormItem from './TextInput'
import * as TextareaFormItem from './Textarea'
import { FormItemConfig } from './types'

export const formItems = {
  [InputFormItem.itemName]: { ...InputFormItem },
  [TextareaFormItem.itemName]: { ...TextareaFormItem }
} as const

export function generateZodSchema(configs: FormItemConfig[]) {
  const schemaObject: Record<string, z.ZodTypeAny> = {}
  configs.forEach((config) => {
    const fieldSchema = formItems[config.itemName].generateZodSchema(
      config as never
    )
    schemaObject[config.id] = fieldSchema
  })

  return z.object(schemaObject)
}
export function generateDefaultValues(configs: FormItemConfig[]) {
  const defaultValues: Record<string, unknown> = {}
  configs.forEach((config) => {
    defaultValues[config.id] = formItems[config.itemName].generateDefaultValue()
  })
  return defaultValues
}
