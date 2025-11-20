'use client'
import EventFormStyle from "../styles/eventForm.module.css"
import EventsStyle from "../styles/events.module.css"
import { useState } from "react"
import { FaUser } from "react-icons/fa"
import { SlCalender } from "react-icons/sl";
import timezones from "../constants/timeZones";
import { GoClock } from "react-icons/go";
import { useSelector, useDispatch } from "react-redux";
import { eventsActions, fetchEvent, fetchEventLogs } from "../store/features/eventsSlice";
import EventLogsPopup from "./EventLogsPopup";
import EventEditPopup from "./EventEditPopup";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export default function Events({ref}) {
  const events = useSelector((state) => state.events.events);
  const dispatch = useDispatch()
  const timezone = useSelector((state) => state.events.timezone);
  const [openLogsPopup, setOpenLogsPopup] = useState(false)
  const [openEditPopup, setOpenEditPopup] = useState(false)
  return (
    <>
    <div className={`${EventsStyle.card} ${EventsStyle.hidden}`} ref={ref}>
      <h3>Events</h3>
      <div className={EventFormStyle.formFields}>
      <div className={EventFormStyle.formGroup}>
        <div className={EventFormStyle.formItem}>
        <label>View in TimeZone</label>
        <select className={EventFormStyle.fieldInput} onChange={(e) => dispatch(eventsActions.setTimezone(e.target.value))}>
          {timezones.map((timezone) => (
            <option key={timezone.value} value={timezone.value}>
              {timezone.label}
            </option>
          ))}
        </select>
        </div>
      </div>
      <div className={EventsStyle.eventsContainer}>
      {events?.map((event) => (
        <div key={event._id} className={EventFormStyle.card}>
            <div className={EventsStyle.userName}>
              <div>
                <FaUser size={16}/>
              </div>
                <p>{event.profiles.map((profile) => profile.name).join(", ")}</p>
            </div>
            <div className={EventsStyle.eventsList}>
                    <div className={EventsStyle.eventItem}>
                      <div className={EventsStyle.eventItemDetails}>
                        <div className={EventsStyle.eventItemDetailsRow}>
                          <SlCalender/>
                          <div>
                            <p>Start: {dayjs(event.eventStartDate).tz(timezone).format("YYYY-MM-DD")}</p>
                            <p className={EventsStyle.eventItemDetailsTime}><GoClock size={12}/>{dayjs(event.eventStartDate).tz(timezone).format("HH:mm")}</p>
                          </div>
                        </div>
                        <div className={EventsStyle.eventItemDetailsRow}>
                          <SlCalender/>
                          <div>
                            <p>End: {dayjs(event.eventEndDate).tz(timezone).format("YYYY-MM-DD")}</p>
                            <p className={EventsStyle.eventItemDetailsTime}><GoClock size={12}/>{dayjs(event.eventEndDate).tz(timezone).format("HH:mm")}</p>
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
                    <button onClick={() => {setOpenEditPopup(true); dispatch(fetchEvent(event._id))}}>Edit</button>
                    <button onClick={() => {setOpenLogsPopup(true); dispatch(fetchEventLogs(event._id))}}>View Logs</button>
                </div>
            </div>
        </div>
      ))}
      </div>
      </div>
      <EventLogsPopup open={openLogsPopup} setOpen={setOpenLogsPopup}/>
      <EventEditPopup open={openEditPopup} setOpen={setOpenEditPopup}/>
    </div>
    </>
  );
}
