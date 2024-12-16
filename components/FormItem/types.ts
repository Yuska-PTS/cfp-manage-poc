import { z } from 'zod'
import type { Config as InputConfig } from './TextInput'

export type BaseConfig = {
  id: string
  itemName: string
  displayName: string
  committeeVisible: boolean
  className: string
}

export const baseConfigSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  displayName: z.string(),
  committeeVisible: z.boolean(),
  className: z.string()
})

export type FormItemConfig = InputConfig
