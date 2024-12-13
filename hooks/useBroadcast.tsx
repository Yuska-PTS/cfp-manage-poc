import { FormItemConfig } from '@/components/FormItem/types'
import { useCallback, useEffect, useRef } from 'react'
import { Theme } from './useTheme'

type ChannelMessage = {
  'preview-form': FormItemConfig[]
  theme: Theme
}

type ChannelMessageListener<T extends keyof ChannelMessage> = (
  message: ChannelMessage[T],
  event: MessageEvent<ChannelMessage[T]>
) => void

export default function useBroadcast<T extends keyof ChannelMessage>(
  channelName: T
) {
  const channelRef = useRef<BroadcastChannel>()
  useEffect(() => {
    const channel = new BroadcastChannel(channelName)
    channelRef.current = channel
    return () => channel.close()
  }, [channelName])

  const send = useCallback((message: ChannelMessage[T]) => {
    channelRef.current?.postMessage(message)
  }, [])

  const listen = useCallback((listener: ChannelMessageListener<T>) => {
    if (!channelRef.current) {
      return
    }
    channelRef.current.onmessage = (event: MessageEvent<ChannelMessage[T]>) => {
      listener(event.data, event)
    }
  }, [])

  return { send, listen }
}
