import {
  validateGuiNumber,
  validateNationalIdNo,
  validateYoutubeUrl
} from '@/lib/validators'
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
  replaceable: boolean
  required: boolean
  maxLength: number
  // GUI: Government Uniform Invoice number (統一編號)
  validation: 'none' | 'email' | 'idNo' | 'youtubeUrl' | 'gui'
}

// zod schema -----------
export const configSchema = baseConfigSchema.extend({
  itemName: z.literal('text-input'),
  label: z.string(),
  placeholder: z.string(),
  description: z.string(),
  note: z.string(),
  unique: z.boolean(),
  disabled: z.boolean(),
  replaceable: z.boolean(),
  required: z.boolean(),
  maxLength: z.coerce.number(),
  validation: z.union([
    z.literal('email'),
    z.literal('idNo'),
    z.literal('youtubeUrl'),
    z.literal('gui'),
    z.literal('none')
  ])
})
// ----------------------

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
    committeeVisible: false,
    replaceable: false,
    required: false,
    maxLength: 50,
    validation: 'none'
  }
}

export function generateZodSchema(config: Config) {
  let schema: z.ZodEffects<z.ZodString, string, string> | z.ZodString =
    z.string()

  if (config.required) {
    schema = schema.min(1, { message: '欄位必填' })
  }
  if (config.maxLength) {
    schema = schema.max(config.maxLength, {
      message: `不能超過${config.maxLength}個字`
    })
  }

  switch (config.validation) {
    case 'email':
      schema = schema.email('email 格式不正確')
      break

    case 'idNo':
      schema = schema.refine(
        (value) => {
          return validateNationalIdNo(value)
        },
        () => ({ message: '身分證字號不正確' })
      )
      break

    case 'gui':
      schema = schema.refine(
        (value) => {
          return validateGuiNumber(value)
        },
        () => ({ message: '統一編號格式錯誤' })
      )
      break

    case 'youtubeUrl':
      schema = schema.refine(
        (value) => {
          return validateYoutubeUrl(value)
        },
        () => ({ message: 'Youtube URL 格式錯誤' })
      )
      break
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
