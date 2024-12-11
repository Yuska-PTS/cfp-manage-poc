import { z } from 'zod'
import type { Config as InputConfig } from './Input'

export type BaseConfig = {
  id: string
  itemName: string
  displayName: string
  replaceable: boolean
  committeeVisible: boolean
  className: string
}

export const baseConfigSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  displayName: z.string(),
  replaceable: z.boolean(),
  committeeVisible: z.boolean(),
  className: z.string()
})

export type FormItemConfig = InputConfig
