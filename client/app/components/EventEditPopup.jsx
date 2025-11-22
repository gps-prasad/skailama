import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import EventLogsStyle from "../styles/eventLogsPopup.module.css"
import EventStyle from "../styles/eventForm.module.css"
import EventEditStyle from "../styles/eventEditFromPopup.module.css"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import TypeHead from "./TypeHead";
import timezones from "../constants/timeZones";
import dayjs from "dayjs";
import { toast } from "sonner";
import DateTimePicker from "./DateTimePicker";
import { dateTimeLocalToUTC } from "../../lib/helpers";

export default function EventEditPopup({open, setOpen, event}) {
    const [loading, setLoading] = useState(false)
    const profiles = useSelector((state) => state.profiles.profiles);
    const [eventData, setEventData] = useState({
      _id: "",
      profiles: [],
      timezone: "",
      eventStartDate: "",
      eventStartTime: "",
      eventEndDate: "",
      eventEndTime: "",
    })

    const setSelectedValues = (res) => {
      setEventData({...eventData, profiles: res})
    }

    const fetchEventData = useCallback(async (eventId) => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/event/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (data.status === false) {
          console.error(data.message)
          return
        }
        const event = data.event
        console.log(event)
        setEventData({
          _id: event._id,
          profiles: event.profiles,
          timezone: event.timezone,
          eventStartDate: dayjs.utc(event.eventStartDate).tz(event.timeZone).format("YYYY-MM-DD"),
          eventStartTime: dayjs.utc(event.eventStartDate).tz(event.timeZone).format("HH:mm:ss.sss"),
          eventEndDate: dayjs.utc(event.eventEndDate).tz(event.timeZone).format("YYYY-MM-DD"),
          eventEndTime: dayjs.utc(event.eventEndDate).tz(event.timeZone).format("HH:mm:ss.sss"),
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }, [])

    const updateEvent = useCallback(async (event) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/updateEvent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        })
        const data = await response.json()
        if (data.status === false) {
          console.error(data.message)
          return
        }
        toast.success("Event updated successfully")
      } catch (error) {
        console.error(error)
        toast.error("Event updation failed")
      }
    }, [])

    useEffect(() => {
      if (!event._id || !open) return
      fetchEventData(event._id)
    }, [event._id,open])

    const onSubmit = () => {
      if (eventData.profiles.length === 0 || eventData.timezone === "" || eventData.eventStartDate === "" || eventData.eventStartTime === "" || eventData.eventEndDate === "" || eventData.eventEndTime === "") {
        toast("Please fill all the fields")
        return
      }
      const {startDate, endDate} = dateTimeLocalToUTC(eventData.eventStartDate, eventData.eventStartTime, eventData.eventEndDate, eventData.eventEndTime, eventData.timezone)
      console.log(startDate, endDate)
      if (startDate > endDate) {
        toast("End date and time must be greater than start date and time")
        return
      }
      const event = {
        _id: eventData._id,
        profiles: eventData.profiles,
        timezone: eventData.timezone,
        eventStartDate: startDate,
        eventEndDate: endDate,
      }
      console.log(event)
      updateEvent(event)
      setOpen(false)
    }

    const onCancel = () => {
      setOpen(()=>false)
      setEventData({
        _id: "",
        profiles: [],
        timezone: "",
        eventStartDate: "",
        eventStartTime: "",
        eventEndDate: "",
        eventEndTime: "",
      })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Event Edit</DialogTitle>
            <DialogDescription className={EventLogsStyle.logsList}>
              {loading ? (
                <span className="loading"></span>
              ) : (
              <div className={EventStyle.formFields}>
              <div className={EventStyle.formGroup}>
                <div className={EventStyle.formItem}>
                <label>Profiles</label>
                <TypeHead profiles={profiles} selectedValues={eventData.profiles} setSelectedValues={setSelectedValues}/>
                </div>
              </div>
              
              <div className={EventStyle.formGroup}>
                <div className={EventStyle.formItem}>
              <label>Timezone</label>
              <select className={EventStyle.fieldInput} value={eventData.timezone} onChange={(e) => setEventData({...eventData, timezone: e.target.value})}>
                {timezones.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>
              </div>
              </div>
              <div className={EventStyle.formGroup}>
              <div className={EventStyle.formItem}>
                <DateTimePicker label="Start Date & Time" date={eventData.eventStartDate} time={eventData.eventStartTime} setTime={(time) => setEventData({...eventData, eventStartTime: time})} setDate={(date) => setEventData({...eventData, eventStartDate: date})} dateMin={new Date()} dateMax={eventData.eventEndDate}/>
              </div>
              </div>
              <div className={EventStyle.formGroup}>
              <div className={EventStyle.formItem}>
                <DateTimePicker label="End Date & Time" date={eventData.eventEndDate} time={eventData.eventEndTime} setTime={(time) => setEventData({...eventData, eventEndTime: time})} setDate={(date) => setEventData({...eventData, eventEndDate: date})} dateMin={eventData.eventStartDate}/>
              </div>
              </div>
              <div className={EventEditStyle.formActions}>
                <button className={EventEditStyle.cancelBtn} onClick={onCancel}>Cancel</button>
                <button className={EventEditStyle.saveBtn} onClick={onSubmit}>Save Changes</button>
              </div>
              </div>
              )}
            </DialogDescription>    
            </DialogHeader>
        </DialogContent>
        </Dialog>
    )
}