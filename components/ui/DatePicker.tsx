'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { forwardRef, useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/Popover'
import { cn } from '@/lib/utils'

const FORMAT_PATTERN = 'yyyy-MM-dd'

type Props = {
  placeholder?: string
  className?: string | string[]
  onChange?: (value?: Date | undefined) => void
  value?: Date
}

const DatePicker = forwardRef<HTMLDivElement, Props>(
  (
    { placeholder = '請輸入日期', value, onChange, className, ...rest },
    ref
  ) => {
    const [date, setDate] = useState<Date | undefined>(value)

    function onSelect(value?: Date) {
      setDate(value)
      if (onChange) {
        onChange(value)
      }
    }

    const dateText = date ? format(date, FORMAT_PATTERN) : placeholder

    return (
      <div ref={ref} className={cn('grid gap-2', className)} {...rest}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon />
              {dateText}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
