import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection } from 'lexical'
import { Link } from 'lucide-react'

import { Toggle } from '@/components/ui/Toggle'
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
    <Toggle
      className="rounded-none"
      aria-label="插入連結"
      pressed={isLink}
      onClick={insertLink}
    >
      <Link />
    </Toggle>
  )
}
