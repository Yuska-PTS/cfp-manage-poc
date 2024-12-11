import { Button } from '@/components/ui/Button'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { CAN_REDO_COMMAND, REDO_COMMAND } from 'lexical'
import { Redo } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function UndoButton() {
  const [editor] = useLexicalComposerContext()
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload)
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
      disabled={!canRedo}
      aria-label="復原"
      onClick={() => {
        editor.dispatchCommand(REDO_COMMAND, undefined)
      }}
    >
      <Redo />
    </Button>
  )
}
