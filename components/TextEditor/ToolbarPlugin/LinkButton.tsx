import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection } from 'lexical'
import { Link } from 'lucide-react'

import { Button } from '@/components/ui/Button'

import { cn } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { getSelectedNode } from '../utils'

export default function LinkButton() {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const $updateButtonState = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    const node = getSelectedNode(selection)
    if (!node) {
      return
    }

    const parent = node.getParent()
    if ($isLinkNode(parent) || $isLinkNode(node)) {
      setIsLink(true)
    } else {
      setIsLink(false)
    }
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
        isLink && 'bg-accent text-accent-foreground'
      )}
      variant="ghost"
      size="icon"
      aria-label="插入連結"
      onClick={insertLink}
    >
      <Link />
    </Button>
  )
}
