'use client'
import { useState } from "react";
import EventStyle from "../styles/eventForm.module.css"
import timezones from "../constants/timeZones";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TypeHead from "./TypeHead";
import { useDispatch, useSelector } from "react-redux";
import { createEvents } from "../store/features/eventsSlice";
import { toast } from "sonner";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventForm({ref}) {
    const dispatch = useDispatch();
    const profiles = useSelector((state) => state.profiles.profiles);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [eventData, setEventData] = useState({
        timezone: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
    })
    const onSubmit = () => {
      if (selectedProfiles.length === 0 || eventData.timezone === "" || eventData.startDate === "" || eventData.startTime === "" || eventData.endDate === "" || eventData.endTime === "") {
        toast("Please fill all the fields")
        return
      }
      const startDate = dayjs.tz(eventData.startDate + " " + eventData.startTime, eventData.timezone).utc().format();
      const endDate = dayjs.tz(eventData.endDate + " " + eventData.endTime, eventData.timezone).utc().format();
      if (startDate > endDate) {
        toast("End date and time must be greater than start date and time")
        return
      }
      const event = {
        profiles: selectedProfiles,
        timezone: eventData.timezone,
        eventStartDate: startDate,
        eventEndDate: endDate,
      }
      dispatch(createEvents(event))
    }
  return (
    <>
    <div className={`${EventStyle.card} ${EventStyle.hidden}`} ref={ref}>
      <h3>Create Event</h3>
      <div className={EventStyle.formFields}>
      <div className={EventStyle.formGroup}>
        <div className={EventStyle.formItem}>
        <label>Profiles</label>
        <TypeHead profiles={profiles} selectedValues={selectedProfiles} setSelectedValues={setSelectedProfiles}/>
        </div>
      </div>
      <div className={EventStyle.formGroup}>
        <div className={EventStyle.formItem}>
      <label>Timezone</label>
      <select className={EventStyle.fieldInput} onChange={(e) => setEventData({...eventData, timezone: e.target.value})}>
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
          <label>Start Date & Time</label>
          <div className={EventStyle.formDateFieldInputs}>
            <input type="date" max={eventData.endDate} className={EventStyle.fieldInput} onChange={(e) => setEventData({...eventData, startDate: e.target.value})}/>
            <input type="time" max={eventData.startDate === eventData.endDate ? eventData.endTime : ""} className={EventStyle.fieldInput} onChange={(e) => setEventData({...eventData, startTime: e.target.value})}/>
          </div>
      </div>
      </div>
      <div className={EventStyle.formGroup}></div>
      <div className={EventStyle.formItem}>
          <label>End Date & Time</label>
          <div className={EventStyle.formDateFieldInputs}>  
            <input type="date" min={eventData.startDate} className={EventStyle.fieldInput} onChange={(e) => setEventData({...eventData, endDate: e.target.value})}/>
            <input type="time" min={eventData.startDate === eventData.endDate ? eventData.startTime : ""} className={EventStyle.fieldInput} onChange={(e) => setEventData({...eventData, endTime: e.target.value})}/>
          </div>
      </div>
      </div>

      <button className={EventStyle.submitBtn} onClick={onSubmit}>+ Create Event</button>

    </div>
    </>
  );
}
