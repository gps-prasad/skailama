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
import { useEffect, useState } from "react";
import { fetchProfiles } from "../store/features/profilesSlice"
import TypeHead from "./TypeHead";
import timezones from "../constants/timeZones";
import dayjs from "dayjs";
import { updateEvent } from "../store/features/eventsSlice";
import { toast } from "sonner";

export default function EventEditPopup({open, setOpen}) {
    const dispatch = useDispatch()
    const event = useSelector((state) => state.events.editEvent);
    const profiles = useSelector((state) => state.profiles.profiles);
    useEffect(() => {
        dispatch(fetchProfiles());
    }, []);
    const [eventData, setEventData] = useState({
        _id: event._id,
        profiles: event.profiles,
        timezone: event.timezone,
        eventStartDate: event.eventStartDate,
        eventEndDate: event.eventEndDate,
        eventStartTime: event.eventStartTime,
        eventEndTime: event.eventEndTime
    })
    useEffect(()=>{
      setEventData(()=>({
        _id: event._id,
        profiles: event.profiles,
        timezone: event.timezone,
        eventStartDate: dayjs.utc(event.eventStartDate).tz(event.timeZone).format("YYYY-MM-DD"),
        eventStartTime: dayjs.utc(event.eventStartDate).tz(event.timeZone).format("HH:mm:ss.sss"),
        eventEndDate: dayjs.utc(event.eventEndDate).tz(event.timeZone).format("YYYY-MM-DD"),
        eventEndTime: dayjs.utc(event.eventEndDate).tz(event.timeZone).format("HH:mm:ss.sss"),
      }))
    },[event])
    const setSelectedValues = (res) => {
      setEventData({...eventData, profiles: res})
    }
    const onSubmit = () => {
      if (eventData.profiles.length === 0 || eventData.timezone === "" || eventData.eventStartDate === "" || eventData.eventStartTime === "" || eventData.eventEndDate === "" || eventData.eventEndTime === "") {
        toast("Please fill all the fields")
        return
      }
      const startDate = dayjs.tz(eventData.eventStartDate + " " + eventData.eventStartTime, eventData.timezone).utc().format("YYYY-MM-DDTHH:mm:ss[.000Z]");
      const endDate = dayjs.tz(eventData.eventEndDate + " " + eventData.eventEndTime, eventData.timezone).utc().format("YYYY-MM-DDTHH:mm:ss[.000Z]");
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
      dispatch(updateEvent(event))
      setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Event Edit</DialogTitle>
            <DialogDescription className={EventLogsStyle.logsList}>
      <p className={EventStyle.formFields}>
      <p className={EventStyle.formGroup}>
        <p className={EventStyle.formItem}>
        <label>Profiles</label>
        <TypeHead profiles={profiles} selectedValues={eventData.profiles} setSelectedValues={setSelectedValues}/>
        </p>
      </p>
      
      <p className={EventStyle.formGroup}>
        <p className={EventStyle.formItem}>
      <label>Timezone</label>
      <select className={EventStyle.fieldInput} value={eventData.timezone} onChange={(e) => setEventData({...eventData, timezone: e.target.value})}>
        {timezones.map((timezone) => (
          <option key={timezone.value} value={timezone.value}>
            {timezone.label}
          </option>
        ))}
      </select>
      </p>
      </p>
      <p className={EventStyle.formGroup}>
      <p className={EventStyle.formItem}>
          <label>Start Date & Time</label>
          <p className={EventStyle.formDateFieldInputs}>
            <input type="date" max={eventData.eventEndDate} className={EventStyle.fieldInput} value={eventData.eventStartDate} onChange={(e) => setEventData({...eventData, eventStartDate: e.target.value})}/>
            <input type="time" max={eventData.eventEndDate === eventData.eventStartDate ? eventData.eventEndTime : ""} value={eventData.eventStartTime} onChange={(e) => setEventData({...eventData, eventStartTime: e.target.value})} className={EventStyle.fieldInput}/>
          </p>
      </p>
      </p>
      <p className={EventStyle.formGroup}></p>
      <p className={EventStyle.formItem}>
          <label>End Date & Time</label>
          <p className={EventStyle.formDateFieldInputs}>  
            <input type="date" min={eventData.eventStartDate} className={EventStyle.fieldInput} value={eventData.eventEndDate} onChange={(e) => setEventData({...eventData, eventEndDate: e.target.value})}/>
            <input type="time" min={eventData.eventStartDate === eventData.eventEndDate ? eventData.eventStartTime : ""} value={eventData.eventEndTime} onChange={(e) => setEventData({...eventData, eventEndTime: e.target.value})} className={EventStyle.fieldInput}/>
          </p>
      </p>
      </p>
      <p className={EventEditStyle.formActions}>
        <button className={EventEditStyle.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
        <button className={EventEditStyle.saveBtn} onClick={onSubmit}>Save Changes</button>
      </p>
            </DialogDescription>    
            </DialogHeader>
        </DialogContent>
        </Dialog>
    )
}