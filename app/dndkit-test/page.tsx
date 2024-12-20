'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { FC, useState } from 'react'

export default function Demo1(): JSX.Element {
  const [items, setItems] = useState(['A', 'B', 'C'])
  function dragEndEvent(e: DragEndEvent) {
    const { over, active } = e
    setItems((items) => {
      return arrayMove(
        items,
        items.indexOf(active.id as string),
        items.indexOf(over?.id as string)
      )
    })
  }

  return (
    <div>
      <h2>Sortable的简单例子1</h2>
      <DndContext onDragEnd={dragEndEvent}>
        <SortableContext items={items}>
          {items.map((v) => (
            <SortableItem key={v} id={v} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

interface SortableItemProps {
  id: string
}
const SortableItem: FC<SortableItemProps> = ({ id }) => {
  const { setNodeRef, listeners, transform, transition } = useSortable({ id })
  const { scaleX = 1, scaleY = 1, x = 0, y = 0 } = transform || {}
  const styles = {
    transform: transform
      ? `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`
      : 'none',
    transition,
    border: '1px solid red',
    marginTop: '10px'
  }
  return (
    <div ref={setNodeRef} {...listeners} style={styles}>
      {id}
    </div>
  )
}
