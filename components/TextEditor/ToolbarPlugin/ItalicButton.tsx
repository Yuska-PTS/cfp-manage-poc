import { Button } from '@/components/ui/Button'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Italic } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export default function ItalicButton() {
  const [editor] = useLexicalComposerContext()
  const [isItalic, setIsItalic] = useState(false)

  const $updateButtonState = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }
    setIsItalic(selection.hasFormat('italic'))
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
        isItalic && 'bg-accent text-accent-foreground'
      )}
      variant="ghost"
      size="icon"
      aria-label="斜體"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
      }}
    >
      <Italic />
    </Button>
  )
}
