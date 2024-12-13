import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Italic } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Toggle } from '@/components/ui/Toggle'

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
    <Toggle
      className="rounded-none"
      aria-label="斜體"
      pressed={isItalic}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
      }}
    >
      <Italic />
    </Toggle>
  )
}
