import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getNearestNodeOfType } from '@lexical/utils'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND
} from 'lexical'

import {
  Check,
  ChevronsUpDown,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  MessageSquareQuote,
  Text
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/Popover'
import { cn } from '@/lib/utils'

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'quote' | 'ul' | 'ol'

function formatParagraph(
  editor: LexicalEditor,
  currentBlockType: BlockType | null
) {
  if (currentBlockType === 'paragraph') {
    return
  }

  editor.update(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode())
    }
  })
}

const formatHeading = (
  editor: LexicalEditor,
  currentBlockType: BlockType | null,
  headingSize: 'h1' | 'h2' | 'h3' | 'h4'
) => {
  if (currentBlockType === headingSize) {
    return
  }

  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createHeadingNode(headingSize))
  })
}

function formatBulletList(
  editor: LexicalEditor,
  currentBlockType: BlockType | null
) {
  if (currentBlockType === 'ul') {
    formatParagraph(editor, currentBlockType)
  } else {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  }
}

function formatNumberedList(
  editor: LexicalEditor,
  currentBlockType: BlockType | null
) {
  if (currentBlockType === 'ol') {
    formatParagraph(editor, currentBlockType)
  } else {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  }
}

function formatQuote(
  editor: LexicalEditor,
  currentBlockType: BlockType | null
) {
  if (currentBlockType === 'quote') {
    return
  }
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createQuoteNode())
  })
}

const BLOCK_TYPES = {
  paragraph: {
    icon: <Text />,
    label: 'Normal',
    format: formatParagraph
  },
  h1: {
    icon: <Heading1 />,
    label: 'Large Heading',
    format(editor: LexicalEditor, currentBlockType: BlockType | null) {
      formatHeading(editor, currentBlockType, 'h1')
    }
  },
  h2: {
    icon: <Heading2 />,
    label: 'Small Heading',
    format(editor: LexicalEditor, currentBlockType: BlockType | null) {
      formatHeading(editor, currentBlockType, 'h2')
    }
  },
  h3: {
    icon: <Heading3 />,
    label: 'Heading',
    format(editor: LexicalEditor, currentBlockType: BlockType | null) {
      formatHeading(editor, currentBlockType, 'h3')
    }
  },
  h4: {
    icon: <Heading4 />,
    label: 'Heading',
    format(editor: LexicalEditor, currentBlockType: BlockType | null) {
      formatHeading(editor, currentBlockType, 'h4')
    }
  },
  quote: {
    icon: <MessageSquareQuote />,
    label: 'Quote',
    format: formatQuote
  },
  ul: {
    icon: <List />,
    label: 'Bulleted List',
    format: formatBulletList
  },
  ol: {
    icon: <ListOrdered />,
    label: 'Numbered List',
    format: formatNumberedList
  }
} as const

const BLOCK_TYPE_KEYS = Object.keys(BLOCK_TYPES) as BlockType[]

export default function BlockTypeMenu() {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<BlockType | null>('paragraph')

  const $updateSelectedType = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    const anchorNode = selection.anchor.getNode()
    const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow()
    const elementKey = element.getKey()
    const elementDOM = editor.getElementByKey(elementKey)
    if (elementDOM === null) {
      return
    }

    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType(anchorNode, ListNode)
      const type = parentList ? parentList.getTag() : element.getTag()
      setValue(type)
    } else {
      const type = $isHeadingNode(element)
        ? element.getTag()
        : element.getType()

      if (type in BLOCK_TYPES) {
        setValue(type as BlockType)
      } else {
        setValue(null)
      }
    }
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateSelectedType()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, $updateSelectedType])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-44 flex-shrink-0 justify-start gap-2 rounded-none border-0"
        >
          {value && BLOCK_TYPES[value].icon} {value && BLOCK_TYPES[value].label}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-10 mt-1 w-44 p-0">
        <Command>
          <CommandList className="rounded-md border">
            <CommandGroup>
              {BLOCK_TYPE_KEYS.map((type) => (
                <CommandItem
                  key={type}
                  value={type}
                  className="cursor-pointer"
                  onSelect={(currentValue) => {
                    const selectedType = currentValue as BlockType
                    setValue(selectedType)
                    setOpen(false)
                    BLOCK_TYPES[selectedType].format(editor, value)
                    setTimeout(() => editor.focus(), 100)
                  }}
                >
                  {BLOCK_TYPES[type].icon} {BLOCK_TYPES[type].label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === type ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
