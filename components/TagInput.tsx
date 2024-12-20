'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { cn } from '@/lib/utils'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable
} from '@dnd-kit/sortable'
import { X } from 'lucide-react'
import { KeyboardEvent, ReactNode, useRef, useState } from 'react'

type Props = {
  value?: string[]
  className?: string
  placeholder?: string
  onChange?: (value: string[]) => void
  onBlur?: () => void
  disabled?: boolean
}

export default function TagInput({
  className,
  placeholder,
  value = [],
  onChange,
  onBlur,
  disabled = false
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState('')
  const itemSet = useRef<Set<string>>(new Set(value))
  const [items, setItems] = useState(value)

  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  function handleDragStart(event: DragEndEvent) {
    const { active } = event

    setActiveId(active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((its) => {
        const oldIndex = its.indexOf(active.id as string)
        const newIndex = its.indexOf(over?.id as string)

        const newItems = arrayMove(its, oldIndex, newIndex)
        itemSet.current = new Set(newItems)
        return newItems
      })
    }
    setActiveId(null)
  }

  function removeItem(value: string) {
    const hasDeleted = itemSet.current.delete(value)
    if (!hasDeleted) {
      return
    }

    const newValue = Array.from(itemSet.current)
    setItems(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  function removeLastItem() {
    if (!itemSet.current.size) {
      return
    }
    const items = Array.from(itemSet.current)
    if (!items.pop()) {
      return
    }

    itemSet.current = new Set(items)
    setItems(items)
    if (onChange) {
      onChange(items)
    }
  }

  function addItem() {
    if (itemSet.current.has(inputValue)) {
      return
    }

    itemSet.current.add(inputValue)
    const newValue = Array.from(itemSet.current)
    setItems(newValue)
    console.log('clear input value')
    setInputValue('')

    if (onChange) {
      onChange(newValue)
    }
  }

  function onKeydown(e: KeyboardEvent) {
    // isComposing === true means it's input method operations(輸入法操作)
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
    if (e.nativeEvent.isComposing) {
      return
    }
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addItem()
    }
    if (e.key === 'Backspace' && inputValue.length === 0) {
      e.preventDefault()
      removeLastItem()
    }
  }

  return (
    <ScrollArea
      onBlur={onBlur}
      className={cn(
        'h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap items-start gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setActiveId(null)
          }}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item} id={item}>
                <Item value={item} disabled={disabled} onRemove={removeItem} />
              </SortableItem>
            ))}
          </SortableContext>

          <DragOverlay>
            {activeId && <Item id={activeId} value={activeId} grab />}
          </DragOverlay>
        </DndContext>

        <input
          ref={inputRef}
          className={cn(
            'h-6 w-[10rem] border-b bg-background text-base outline-none placeholder:text-muted-foreground md:text-sm'
          )}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          placeholder={placeholder}
          onKeyDown={onKeydown}
          disabled={disabled}
        />
      </div>
    </ScrollArea>
  )
}

type ItemProps = {
  id?: string
  value: string
  disabled?: boolean
  grab?: boolean
  onRemove?: (value: string) => void
}

function Item({ value, disabled = false, onRemove, grab = false }: ItemProps) {
  return (
    <Badge className={cn('truncate', grab && 'cursor-grabbing')}>
      {value}
      {!disabled && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-4 w-4"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (onRemove) {
              onRemove(value)
            }
          }}
        >
          <X className="w-3" />
        </Button>
      )}
    </Badge>
  )
}

function SortableItem(props: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })

  const { scaleX = 1, scaleY = 1, x = 0, y = 0 } = transform || {}

  const style = {
    transform: transform
      ? `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`
      : 'none',
    transition,
    cursor: 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  )
}
