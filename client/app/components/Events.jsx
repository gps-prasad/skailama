'use client'
import EventFormStyle from "../styles/eventForm.module.css"
import EventsStyle from "../styles/events.module.css"
import { useState } from "react"
import { SquarePen } from 'lucide-react';
import { Logs } from 'lucide-react';
import { Users } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import timezones from "../constants/timeZones";
import { Clock } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { fetchEvent, fetchEventLogs } from "../store/features/eventsSlice";
import EventLogsPopup from "./EventLogsPopup";
import EventEditPopup from "./EventEditPopup";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

dayjs.extend(timezone);
dayjs.extend(utc);

export default function Events({ref, events}) {
  const [timezone, setTimezone] = useState("UTC")
  const dispatch = useDispatch()
  const [openLogsPopup, setOpenLogsPopup] = useState(false)
  const [openEditPopup, setOpenEditPopup] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState({})

  return (
    <>
    <div className={`${EventsStyle.card} ${EventsStyle.hidden}`} ref={ref}>
      <h3>Events</h3>
      <div className={EventFormStyle.formFields}>
      <div className={EventFormStyle.formGroup}>
        <div className={EventFormStyle.formItem}>
        <label>View in TimeZone</label>
        <Select value={timezone} onValueChange={(value) => setTimezone(value)}>
        <SelectTrigger style={{width: "100%"}}>
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          {timezones.map((timezone) => (
            <SelectItem key={timezone.value} value={timezone.value}>
              {timezone.label}
            </SelectItem>
          ))}
      </SelectContent>
      </Select>
        </div>
      </div>
      <div className={EventsStyle.eventsContainer}>
      {events?.map((event) => (
        <div key={event._id} className={`${EventFormStyle.card} ${EventsStyle.outline}`}>
            <div className={EventsStyle.userName}>
              <div>
                <Users style={{color: "var(--color-primary)"}} size={18}/>
              </div>
                <p>{event.profiles.map((profile) => profile.name).join(", ")}</p>
            </div>
            <div className={EventsStyle.eventsList}>
                    <div className={EventsStyle.eventItem}>
                      <div className={EventsStyle.eventItemDetails}>
                        <div className={EventsStyle.eventItemDetailsRow}>
                          <CalendarDays size={18}/>
                          <div>
                            <p>Start: {dayjs(event.eventStartDate).tz(timezone).format("YYYY-MM-DD")}</p>
                            <p className={EventsStyle.eventItemDetailsTime}><Clock size={12}/>{dayjs(event.eventStartDate).tz(timezone).format("HH:mm")}</p>
                          </div>
                        </div>
                        <div className={EventsStyle.eventItemDetailsRow}>
                          <CalendarDays size={18} />
                          <div>
                            <p>End: {dayjs(event.eventEndDate).tz(timezone).format("YYYY-MM-DD")}</p>
                            <p className={EventsStyle.eventItemDetailsTime}><Clock size={12}/>{dayjs(event.eventEndDate).tz(timezone).format("HH:mm")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                <hr/>
                <div className={EventsStyle.eventLogs}>
                    <p>Created: {dayjs(event.createdAt).tz(timezone).format("YYYY-MM-DD HH:mm:ss")}</p>
                    <p>Updated: {dayjs(event.updatedAt).tz(timezone).format("YYYY-MM-DD HH:mm:ss")}</p>
                </div>
                <hr/>
                <div className={EventsStyle.eventActions}>
                    <Button variant='outline' onClick={() => {setOpenEditPopup(true); setSelectedEvent(event)}}><SquarePen size={18}/>Edit</Button>
                    <Button variant='outline' onClick={() => {setOpenLogsPopup(true); setSelectedEvent(event)}}><Logs size={18}/>View Logs</Button>
                </div>
            </div>
        </div>
      ))}
      </div>
      </div>
      <EventLogsPopup open={openLogsPopup} setOpen={setOpenLogsPopup} event={selectedEvent}/>
      <EventEditPopup open={openEditPopup} setOpen={setOpenEditPopup} event={selectedEvent}/>
    </div>
    </>
  );
}
