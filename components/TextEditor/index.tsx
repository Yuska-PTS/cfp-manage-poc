import { CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { LexicalEditor } from 'lexical'

import { ScrollArea } from '@/components/ui/ScrollArea'
import AutoLinkPlugin from './AutoLinkPlugin'
import LinkEditorPlugin from './LinkEditorPlugin'
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
  value = '',
  editable = false,
  autoFocus = false,
  namespace = 'TextEditor',
  debug = false
}: Props) {
  const initialConfig = {
    ...defaultConfig,
    editable,
    namespace,
    editorState: () => $convertFromMarkdownString(value, TRANSFORMERS)
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rounded-md border" onBlur={onBlur}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ScrollArea className="flex min-h-16 max-w-full resize-y">
              <ContentEditable
                className="prose flex-grow p-2 outline-0 dark:prose-invert"
                aria-placeholder="請輸入文字"
                placeholder={(isEditable: boolean) => (
                  <div className="absolute left-0 top-0 z-[-1] p-2 text-muted-foreground">
                    {isEditable ? '請輸入文字' : '(無內容)'}
                  </div>
                )}
              />
              <LinkEditorPlugin />
            </ScrollArea>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(_, editor) => {
            editor.update(() => {
              const markdown = $convertToMarkdownString(TRANSFORMERS)
              if (onChange) {
                onChange(markdown)
              }
            })
          }}
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

export function MarkdownToHtml({ value }: { value: string }) {
  const config = {
    namespace: 'ReadonlyTextEditor',
    nodes: [
      CodeNode,
      LinkNode,
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
    editorState: () => $convertFromMarkdownString(value, TRANSFORMERS),
    editable: false
  }

  return (
    <LexicalComposer key={value} initialConfig={config}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="prose dark:prose-invert" />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  )
}
