import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'

import BlockTypeMenu from './BlockTypeMenu'
import BoldToggle from './BoldToggle'
import CodeToggle from './CodeToggle'
import ItalicToggle from './ItalicToggle'
import LinkToggle from './LinkToggle'
import RedoButton from './RedoButton'
import UndoButton from './UndoButton'

export default function ToolbarPlugin() {
  return (
    <ScrollArea>
      <div className="flex overflow-clip rounded-t-md border-b-[1px]">
        <UndoButton />
        <RedoButton />
        <BlockTypeMenu />
        <BoldToggle />
        <ItalicToggle />
        <CodeToggle />
        <LinkToggle />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
