'use client'
import { useState, useEffect } from "react";
import EventStyle from "../styles/eventForm.module.css"
import timezones from "../constants/timeZones";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TypeHead from "./TypeHead";
import { useDispatch, useSelector } from "react-redux";
import { createEvents } from "../store/features/eventsSlice";
import { toast } from "sonner";
import DateTimePicker from "./DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dateTimeLocalToUTC } from "../../lib/helpers"

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
        toast.warning("Please fill all the fields")
        return
      }
      const {startDate, endDate} = dateTimeLocalToUTC(eventData.startDate, eventData.startTime, eventData.endDate, eventData.endTime, eventData.timezone)
      if (startDate > endDate) {
        toast.warning("End date and time must be greater than start date and time")
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
        <TypeHead profiles={profiles} selectedValues={selectedProfiles} setSelectedValues={setSelectedProfiles} multiSelect={true}/>
        </div>
      </div>
      <div className={EventStyle.formGroup}>
        <div className={EventStyle.formItem}>
      <label>Timezone</label>
      <Select value={eventData.timezone} onValueChange={(value) => setEventData({...eventData, timezone: value})}>
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
      <div className={EventStyle.formGroup}>
      <div className={EventStyle.formItem}>
        <DateTimePicker label="Start Date & Time" date={eventData.startDate} time={eventData.startTime} setTime={(time) => setEventData({...eventData, startTime: time})} setDate={(date) => setEventData({...eventData, startDate: date})} dateMin={new Date()} dateMax={eventData.endDate}/>
      </div>
      </div>
      <div className={EventStyle.formGroup}></div>
      <div className={EventStyle.formItem}>
        <DateTimePicker label="End Date & Time" date={eventData.endDate} time={eventData.endTime} setTime={(time) => setEventData({...eventData, endTime: time})} setDate={(date) => setEventData({...eventData, endDate: date})} dateMin={eventData.startDate}/>
      </div>
      </div>

      <button className={EventStyle.submitBtn} onClick={onSubmit}>+ Create Event</button>

    </div>
    </>
  );
}
