import { Button } from '@/components/ui/Button'
import { INSERT_ORDERED_LIST_COMMAND } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { CAN_UNDO_COMMAND, UNDO_COMMAND } from 'lexical'
import { Undo } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function UndoButton() {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload)
        return false
      },
      1
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      INSERT_ORDERED_LIST_COMMAND,
      () => {
        console.log('insert!!')
        return false
      },
      1
    )
  }, [editor])

  return (
    <Button
      className="rounded-none"
      variant="ghost"
      size="icon"
      disabled={!canUndo}
      aria-label="復原"
      onClick={() => {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
      }}
    >
      <Undo />
    </Button>
  )
}
