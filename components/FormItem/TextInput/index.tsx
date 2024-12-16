import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import type { BaseConfig } from '../types'
import { baseConfigSchema } from '../types'

export { default as ConfigForm } from './ConfigForm'
export { default as FormItem } from './FormItem'

export interface Config extends BaseConfig {
  itemName: 'text-input'
  label: string
  placeholder: string
  description: string
  note: string
  unique: boolean
  disabled: boolean
  value: string
  replaceable: boolean
  maxLength: number | null

  // validation: {
  //   required?: boolean
  //   min?: number
  //   max?: number
  //   pattern?: string
  // }

  // value?: string | boolean | Date | number | string[]
  // valueType?: 'timestamp' | 'number' | 'string'
  // validations: Validation
}

export const configSchema = baseConfigSchema.extend({
  itemName: z.literal('text-input'),
  label: z.string(),
  placeholder: z.string(),
  description: z.string(),
  note: z.string(),
  unique: z.boolean(),
  disabled: z.boolean(),
  value: z.string(),
  replaceable: z.boolean(),
  maxLength: z.number().nullable()
})

export const itemName = 'text-input'
export const displayName = '文字輸入欄位'

export function generateConfig(): Config {
  return {
    itemName,
    displayName,
    id: uuidv4(),
    label: 'New field',
    placeholder: '',
    description: '',
    note: '',
    unique: false,
    disabled: false,
    className: '',
    value: '',
    committeeVisible: false,
    replaceable: false,
    maxLength: null
  }
}
