import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isAtNodeEnd } from '@lexical/selection'
import { $getSelection, $isRangeSelection, RangeSelection } from 'lexical'
import { Link } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/Popover'

import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'

function getSelectedNode(selection: RangeSelection | null) {
  const anchor = selection?.anchor
  const focus = selection?.focus
  const anchorNode = selection?.anchor.getNode()
  const focusNode = selection?.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection?.isBackward()
  if (isBackward) {
    if (!focus) {
      return null
    }
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    if (!anchor) {
      return null
    }
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0'
    editor.style.top = '-1000px'
    editor.style.left = '-1000px'
  } else {
    editor.style.opacity = '1'
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`
  }
}

export default function LinkButton() {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef(null)
  const [url, setUrl] = useState('')
  const [isEditMode, setEditMode] = useState(false)
  const [lastSelection, setLastSelection] = useState(null)

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

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node?.getParent()
      if ($isLinkNode(parent)) {
        setUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setUrl(node.getURL())
      } else {
        setUrl('')
      }
    }
    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection?.anchorNode)
    ) {
      const domRange = nativeSelection?.getRangeAt(0)
      let rect
      if (nativeSelection?.anchorNode === rootElement) {
        let inner = rootElement
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange?.getBoundingClientRect()
      }

      positionEditorElement(editorElem, rect)
      setLastSelection(selection)
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null)
      setLastSelection(null)
      setEditMode(false)
      setUrl('')
    }

    return true
  }, [editor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditMode])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateButtonState()
      })
    })
  }, [editor, $updateButtonState])

  return (
    <Popover open={isEditMode} onOpenChange={setEditMode}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent ref={editorRef} className="w-48">
        <Input
          ref={inputRef}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </PopoverContent>
    </Popover>
  )
}
