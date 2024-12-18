import { z } from 'zod'
import type { TextInputConfig } from './TextInput'
import type { TextareaConfig } from './Textarea'

export type BaseConfig = {
  id: string
  itemName: string
  itemDisplayName: string
  committeeVisible: boolean
}

export type FormItemConfig = TextInputConfig | TextareaConfig

export const baseConfigSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  itemDisplayName: z.string(),
  committeeVisible: z.boolean()
})
