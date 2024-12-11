import { Button } from '@/components/ui/Button'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Code } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export default function CodeButton() {
  const [editor] = useLexicalComposerContext()
  const [isCode, setIsCode] = useState(false)

  const $updateButtonState = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }
    setIsCode(selection.hasFormat('code'))
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateButtonState()
      })
    })
  }, [editor, $updateButtonState])

  return (
    <Button
      className={cn(
        'rounded-none text-muted-foreground',
        isCode && 'bg-accent text-accent-foreground'
      )}
      variant="ghost"
      size="icon"
      aria-label="程式碼"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
      }}
    >
      <Code />
    </Button>
  )
}
