import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  BaseSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import { computePosition, flip, offset } from '@floating-ui/dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { mergeRegister } from '@lexical/utils'
import { Check, Edit } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getSelectedNode } from './utils'

export default function LinkEditorPlugin() {
  const [editor] = useLexicalComposerContext()
  const inputElmRef = useRef<HTMLInputElement>(null)
  const linkEditorElmRef = useRef<HTMLDivElement>(null)

  const [url, setUrl] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  function resetLinkEditor() {
    setIsVisible(false)
    setLastSelection(null)
    setIsEditMode(false)
    setUrl('')
  }

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    let isLinkNode = false
    let linkNode: LinkNode | null = null
    const node = getSelectedNode(selection)
    const parent = node?.getParent()
    if ($isLinkNode(parent)) {
      isLinkNode = true
      linkNode = parent
      setUrl(parent.getURL())
    } else if ($isLinkNode(node)) {
      isLinkNode = true
      linkNode = node
      setUrl(node.getURL())
    }

    if (!isLinkNode || !linkNode) {
      resetLinkEditor()
      return
    }

    const linkEditorElm = linkEditorElmRef.current
    const nativeSelection = window.getSelection()

    const hasTextSelection =
      linkEditorElm && nativeSelection && !nativeSelection.isCollapsed

    if (!hasTextSelection) {
      resetLinkEditor()
      return
    }

    const linkElm = editor.getElementByKey(linkNode.getKey())
    if (!linkElm || !linkEditorElm) {
      return
    }

    computePosition(linkElm, linkEditorElm, {
      placement: 'bottom-start',
      middleware: [flip(), offset(5)]
    }).then(({ x, y }) => {
      Object.assign(linkEditorElm.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })

    setIsVisible(true)
    setLastSelection(selection)
  }, [editor])

  useEffect(() => {
    function onScroll() {
      setIsVisible(false)
    }
    document.addEventListener('scroll', onScroll)

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputElmRef.current) {
      inputElmRef.current.focus()
    }
  }, [isEditMode])

  function saveLinkUrl() {
    if (lastSelection === null) {
      return
    }
    if (url.trim() !== '') {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
    }
    setIsEditMode(false)
  }

  return (
    <div ref={linkEditorElmRef} className="fixed">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="flex min-w-48 max-w-64 items-center justify-between gap-2 rounded-md border bg-background px-4 py-2 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ duration: 0.2, ease: 'linear' }}
            exit={{ opacity: 0 }}
          >
            {isEditMode ? (
              <>
                <Input
                  ref={inputElmRef}
                  className="border-none bg-accent py-0 outline-none focus-visible:ring-transparent"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      saveLinkUrl()
                    } else if (event.key === 'Escape') {
                      event.preventDefault()
                      setIsEditMode(false)
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="儲存"
                  className="shrink-0"
                  onClick={() => saveLinkUrl()}
                >
                  <Check />
                </Button>
              </>
            ) : (
              <>
                <a
                  href={url}
                  className="truncate underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="修改"
                  className="shrink-0"
                  onClick={() => setIsEditMode(true)}
                >
                  <Edit />
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
