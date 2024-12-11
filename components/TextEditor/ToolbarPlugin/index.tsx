import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import BlockTypeMenu from './BlockTypeMenu'
import BoldButton from './BoldButton'
import CodeButton from './CodeButton'
import ItalicButton from './ItalicButton'
import LinkButton from './LinkButton'
import RedoButton from './RedoButton'
import UndoButton from './UndoButton'

export default function ToolbarPlugin() {
  return (
    <ScrollArea>
      <div className="flex overflow-clip rounded-t-md border-b-[1px]">
        <UndoButton />
        <RedoButton />
        <BlockTypeMenu />
        <BoldButton />
        <ItalicButton />
        <CodeButton />
        <LinkButton />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
