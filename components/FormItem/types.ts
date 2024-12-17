import { z } from 'zod'
import type { Config as TextInputConfig } from './TextInput'

export type BaseConfig = {
  id: string
  itemName: string
  displayName: string
  committeeVisible: boolean
}

export type FormItemConfig = TextInputConfig

export const baseConfigSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  displayName: z.string(),
  committeeVisible: z.boolean()
})
