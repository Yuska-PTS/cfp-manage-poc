import { CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { LexicalEditor } from 'lexical'

import { ScrollArea } from '@/components/ui/ScrollArea'
import AutoLinkPlugin from './AutoLinkPlugin'
import ToolbarPlugin from './ToolbarPlugin'
import TreeViewPlugin from './TreeViewPlugin'

type Props = {
  onChange?: (value: string) => void
  onBlur?: () => void
  value?: string
  editable?: boolean
  autoFocus?: boolean
  namespace?: string
  debug?: boolean
}

const defaultConfig = {
  namespace: 'TextEditor',
  nodes: [
    CodeNode,
    LinkNode,
    AutoLinkNode,
    ListNode,
    ListItemNode,
    HeadingNode,
    QuoteNode,
    HorizontalRuleNode,
    TableNode,
    TableCellNode,
    TableRowNode
  ],
  onError(error: Error, editor: LexicalEditor) {
    console.error('[TextEditor] ' + error.message, error)
    console.dir(editor)
  },
  editable: false,
  autoFocus: false
}

export default function TextEditor({
  onChange,
  onBlur,
  value,
  editable = false,
  autoFocus = false,
  namespace = 'TextEditor',
  debug = false
}: Props) {
  const initialConfig = { ...defaultConfig, editable, namespace }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rounded-md border">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ScrollArea className="relative flex min-h-16 max-w-full resize-y">
              <ContentEditable
                className="prose flex-grow p-2 outline-0 dark:prose-invert"
                aria-placeholder="請輸入文字"
                placeholder={(isEditable: boolean) => (
                  <div className="absolute left-0 top-0 z-[-1] p-2 text-muted-foreground">
                    {isEditable ? '請輸入文字' : '(無內容)'}
                  </div>
                )}
              />
            </ScrollArea>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* This plugin will register list commands to create list block.*/}
        {/* After register we can just dispatch list command(call in BlockTypeMenu) to create list block */}
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <HistoryPlugin />
        {autoFocus && <AutoFocusPlugin />}
      </div>
      {debug && <TreeViewPlugin />}
    </LexicalComposer>
  )
}
