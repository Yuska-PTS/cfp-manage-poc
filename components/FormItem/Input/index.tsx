import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import type { BaseConfig } from '../types'
import { baseConfigSchema } from '../types'

export { default as ConfigForm } from './ConfigForm'
export { default as FormItem } from './FormItem'

export interface Config extends BaseConfig {
  itemName: 'input'
  label: string
  placeholder: string
  description: string
  note: string
  unique: boolean
  disabled: boolean
  value: string
  inputType: 'text' | 'number' | 'email'

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
  itemName: z.literal('input'),
  label: z.string(),
  placeholder: z.string(),
  description: z.string(),
  note: z.string(),
  unique: z.boolean(),
  disabled: z.boolean(),
  value: z.string(),
  inputType: z.union([
    z.literal('text'),
    z.literal('number'),
    z.literal('email')
  ])
})

export const itemName = 'input'
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
    inputType: 'text',
    className: '',
    value: '',
    committeeVisible: true,
    replaceable: false
  }
}
