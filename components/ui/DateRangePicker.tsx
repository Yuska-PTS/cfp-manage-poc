'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { forwardRef, useState } from 'react'
import { DateRange } from 'react-day-picker'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/Popover'
import { cn } from '@/lib/utils'

const FORMAT_PATTERN = 'yyyy-MM-dd'

type Props = {
  className?: string | string[]
  onChange?: (value?: DateRange | undefined) => void
  value?: DateRange
}

const DateRangePicker = forwardRef<HTMLDivElement, Props>(
  ({ value, onChange, className, ...rest }, ref) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(value)

    function onSelect(value?: DateRange) {
      setDateRange(value)
      if (onChange) {
        onChange(value)
      }
    }

    const dateRangeText = dateRange?.from
      ? dateRange.to
        ? `${format(dateRange.from, FORMAT_PATTERN)} ~ ${format(dateRange.to, FORMAT_PATTERN)}`
        : format(dateRange.from, FORMAT_PATTERN)
      : '請選擇日期'

    return (
      <div ref={ref} className={cn('grid gap-2', className)} {...rest}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon />
              {dateRangeText}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

DateRangePicker.displayName = 'DateRangePicker'

export default DateRangePicker
