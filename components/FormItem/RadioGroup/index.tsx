import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import type { BaseConfig } from '../types'
import { baseConfigSchema } from '../types'

export { default as ConfigForm } from './ConfigForm'
export { default as FormItem } from './FormItem'

export interface Config extends BaseConfig {
  itemName: 'radio-group'
  label: string
  description: string
  disabled: boolean
  replaceable: boolean
  required: boolean
  options: string[]
}

// zod schema -----------
export const configSchema = baseConfigSchema.extend({
  itemName: z.literal('radio-group'),
  label: z.string(),
  description: z.string(),
  disabled: z.boolean(),
  replaceable: z.boolean(),
  required: z.boolean(),
  options: z.array(z.string())
})
// ----------------------

export const itemName = 'radio-group'
export const itemDisplayName = '單選按鈕群組'

export function generateConfig(): Config {
  return {
    itemName,
    itemDisplayName,
    id: uuidv4(),
    label: 'New field',
    description: '',
    disabled: false,
    committeeVisible: false,
    replaceable: false,
    required: false,
    options: []
  }
}

export function generateZodSchema(config: Config) {
  let schema = z.string()

  if (config.required) {
    schema = schema.min(1, { message: '欄位必填' })
  }

  if (config.required) {
    return schema
  } else {
    return z.union([z.literal(''), schema])
  }
}

export function generateDefaultValue() {
  return ''
}
