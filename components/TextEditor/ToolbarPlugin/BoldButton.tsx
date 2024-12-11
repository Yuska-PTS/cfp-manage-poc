import { Button } from '@/components/ui/Button'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Bold } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export default function BoldButton() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)

  const $updateButtonState = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }
    setIsBold(selection.hasFormat('bold'))
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
        isBold && 'bg-accent text-accent-foreground'
      )}
      variant="ghost"
      size="icon"
      aria-label="粗體"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
      }}
    >
      <Bold />
    </Button>
  )
}
