import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import type { BaseConfig } from '../types'
import { baseConfigSchema } from '../types'

export { default as ConfigForm } from './ConfigForm'
export { default as FormItem } from './FormItem'

export interface Config extends BaseConfig {
  itemName: 'textarea'
  label: string
  placeholder: string
  description: string
  note: string
  disabled: boolean
  replaceable: boolean
  required: boolean
  maxLength: number
  resizable: boolean
}

// zod schema -----------
export const configSchema = baseConfigSchema.extend({
  itemName: z.literal('textarea'),
  label: z.string(),
  placeholder: z.string(),
  description: z.string(),
  note: z.string(),
  disabled: z.boolean(),
  replaceable: z.boolean(),
  required: z.boolean(),
  maxLength: z.coerce.number(),
  resizable: z.boolean()
})
// ----------------------

export const itemName = 'textarea'
export const itemDisplayName = '長文字區塊'

export function generateConfig(): Config {
  return {
    itemName,
    itemDisplayName,
    id: uuidv4(),
    label: 'New field',
    placeholder: '',
    description: '',
    note: '',
    disabled: false,
    committeeVisible: false,
    replaceable: false,
    required: false,
    maxLength: 100,
    resizable: false
  }
}

export function generateZodSchema(config: Config) {
  let schema = z.string()

  if (config.required) {
    schema = schema.min(1, { message: '欄位必填' })
  }
  if (config.maxLength) {
    schema = schema.max(config.maxLength, {
      message: `不能超過${config.maxLength}個字`
    })
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
