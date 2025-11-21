"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import dayjs from "dayjs";
import { cn } from "@/lib/utils"

export default function DateTimePicker({label,date, setDate,time,setTime,dateMin,dateMax}: {label: string, date: Date | undefined, setDate: (date: Date | undefined) => void,time: string | undefined,setTime: (time: string | undefined) => void,dateMin?: Date | undefined,dateMax?: Date | undefined}) {
  const [open, setOpen] = React.useState(false)
  const disableDates = (date: Date) => {
    const calendarDate = dayjs(date);
    const isPastDate = dateMin? calendarDate.isBefore(dayjs(dateMin).startOf('day')) 
    : false;
    const isFutureDate = dateMax ? calendarDate.isAfter(dayjs(dateMax).endOf('day')) : false;
    return isPastDate || isFutureDate;
  };

  return (
    <div className="flex gap-4">
      <div className="flex-3 flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="min-w-32 w-full justify-between font-normal"
            >
              {date && dayjs(date).isValid() ? new Date(date).toLocaleDateString() : "Select date"}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                console.log(date)
                setDate(date)
                setOpen(false)
              }}
              disabled={disableDates}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-3">
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value)
              }}
              data-slot="input"
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              )}
            />
      </div>
    </div>
  )
}
