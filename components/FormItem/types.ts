import { z } from 'zod'
import type { Config as TextInputConfig, itemName as TextInputItemName } from './TextInput'
import type { Config as TextareaConfig, itemName as TextareaItemName } from './Textarea'

export type BaseConfig = {
  id: string
  itemName: string
  itemDisplayName: string
  committeeVisible: boolean
}


export type FormItemConfigMap = {
  [TextInputItemName]: TextInputConfig
  [TextareaItemName]: TextareaConfig
}

type FormItemConfigType<T extends keyof FormItemConfigMap> = {
  [key in keyof FormItemConfigMap[T]]: FormItemConfigMap[T][key]
}


/**
 * Priviously I wrote the union type like this:
 *
 * type FormItemConfig = TextInputConfig | TextareaConfig | ...
 *
 * But it has type inference issue inside the loop. To solve that issue we
 * have to use map type with generic params to make type inference correctly.
 * For more detail see https://github.com/microsoft/TypeScript/pull/47109
 */
export type FormItemConfigUnion<K extends keyof FormItemConfigMap = keyof FormItemConfigMap> = { [P in K]: FormItemConfigType<P>}[K];


export const baseConfigSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  itemDisplayName: z.string(),
  committeeVisible: z.boolean()
})
