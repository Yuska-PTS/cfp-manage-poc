import { Toggle } from '@/components/ui/Toggle'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Bold } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

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
    <Toggle
      className="rounded-none"
      aria-label="粗體"
      pressed={isBold}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
      }}
    >
      <Bold />
    </Toggle>
  )
}
