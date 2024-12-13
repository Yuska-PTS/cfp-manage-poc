import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Code } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Toggle } from '@/components/ui/Toggle'

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
    <Toggle
      className="rounded-none"
      aria-label="程式碼"
      pressed={isCode}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
      }}
    >
      <Code />
    </Toggle>
  )
}
