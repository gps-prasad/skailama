'use client'
import EventForm from "../components/EventForm"
import Events from "../components/Events"
import pageStyle from "../styles/page.module.css"
import { useState, useEffect, useLayoutEffect, useCallback } from "react"
import { useRef } from "react"
import TypeHead from "../components/TypeHead"
import { useSelector, useDispatch } from "react-redux"
import { fetchProfiles } from "../store/features/profilesSlice"
import { profilesActions } from "../store/features/profilesSlice"
import { toast } from "sonner"

export default function Page() {
    const dispatch = useDispatch();
    const eventFormRef = useRef(null)
    const eventListRef = useRef(null)
    const activeProfile = useSelector((state) => state.profiles.activeProfile);
    const profiles = useSelector((state) => state.profiles.profiles);
    const [events, setEvents] = useState([])

    useLayoutEffect(() => {
        if (!eventFormRef.current || !eventListRef.current) return

        eventListRef.current.style.maxHeight = eventFormRef.current.offsetHeight + "px"   
        eventListRef.current.style.visibility = "visible"
        eventFormRef.current.style.visibility = "visible"
        const syncHeight = () => {
            if (!eventFormRef.current || !eventListRef.current) return;
            eventListRef.current.style.minHeight =
              eventFormRef.current.offsetHeight + "px";
            eventListRef.current.style.maxHeight =
              eventFormRef.current.offsetHeight + "px";
        };
        syncHeight()
        window.addEventListener("resize", syncHeight)
        return () => {
            window.removeEventListener("resize", syncHeight)
        }
    }, [eventFormRef, eventListRef])

    useEffect(() => {
        dispatch(fetchProfiles());
    }, []);

    const fetchEvents = useCallback(async (activeProfile) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/events/${activeProfile._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()
            if (data.status === false) {
                setEvents([])
                toast.error(data.message)
                return
            }
            if (data.events.length === 0) {
                setEvents([])
                toast.info("No events found")
                return
            }
            toast.success(data.message + ' for ' + activeProfile.name)
            console.log(data.events)
            setEvents(data.events)
        } catch (error) {
            setEvents([])
            toast.error("Failed to fetch events")
        }
    }, []);

    useEffect(() => {
        if (!activeProfile) return;
        fetchEvents(activeProfile);
    }, [activeProfile]);

    const changeActiveProfile = (profile) => {
        if (profile.length === 0) return;
        dispatch(profilesActions.setActiveProfile(profile[profile.length - 1]));
    }
  return (
    <div>
        <div className={pageStyle.container}>
        <div className={pageStyle.header}>
            <div className={pageStyle.headerTitle}>
                <h1>Event Management</h1>
                <p>Create and manage events across multiple timezones</p>
            </div>
            <div className={pageStyle.headerButtons}>
                <TypeHead profiles={profiles} selectedValues={activeProfile !==''?[activeProfile]:[]} setSelectedValues={changeActiveProfile} multiSelect={false}/>
            </div>
        </div>
        <div className={pageStyle.body}>
            <>
                <EventForm ref={eventFormRef}/>
                <Events ref={eventListRef} events={events}/>
            </>
        </div>
    </div>
    </div>
  );
}
