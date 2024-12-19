import type { FormItemConfigUnion } from '@/components/FormItem/types'
import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

type PageContextType = {
  configs: FormItemConfigUnion[]
  setConfigs: (configs: FormItemConfigUnion[]) => void
  addConfig: (config: FormItemConfigUnion) => void
  removeConfig: (id: string) => void
  updateConfig: (config: FormItemConfigUnion) => void
}

const PageContext = createContext<PageContextType>(null!)

export const usePageContext = () => {
  return useContext(PageContext)
}

export function PageContextProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<FormItemConfigUnion[]>([])

  const addConfig = useCallback(
    (config: FormItemConfigUnion) => {
      setConfigs([...configs, config])
    },
    [configs]
  )

  const removeConfig = useCallback(
    (id: string) => {
      // TODO 要能 loop 第二層
      const index = configs.findIndex((c) => c.id === id)
      if (index === -1) {
        return
      }

      const newConfigs = configs.slice()
      newConfigs.splice(index, 1)
      setConfigs(newConfigs)
    },
    [configs]
  )

  const updateConfig = useCallback(
    (config: FormItemConfigUnion) => {
      // TODO 要能 loop 第二層
      const index = configs.findIndex((c) => c.id === config.id)
      if (index === -1) {
        return
      }

      const newConfig = { ...configs[index], ...config }
      const newConfigs = configs.slice()
      newConfigs.splice(index, 1, newConfig)
      setConfigs(newConfigs)
    },
    [configs]
  )

  const providerObj = useMemo(() => {
    return {
      configs,
      setConfigs,
      addConfig,
      removeConfig,
      updateConfig
    }
  }, [addConfig, configs, removeConfig, updateConfig])

  return (
    <PageContext.Provider value={providerObj}>{children}</PageContext.Provider>
  )
}
