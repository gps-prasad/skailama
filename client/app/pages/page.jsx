'use client'
import EventForm from "../components/EventForm"
import Events from "../components/Events"
import pageStyle from "../styles/page.module.css"
import { useState, useEffect, useLayoutEffect } from "react"
import { useRef } from "react"
import TypeHead from "../components/TypeHead"
import { useSelector, useDispatch } from "react-redux"
import { fetchProfiles } from "../store/features/profilesSlice"
import { profilesActions } from "../store/features/profilesSlice"
import { fetchEvents } from "../store/features/eventsSlice"

export default function Page() {
    const dispatch = useDispatch();
    const eventFormRef = useRef(null)
    const eventListRef = useRef(null)
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
    const activeProfile = useSelector((state) => state.profiles.activeProfile);
    const profiles = useSelector((state) => state.profiles.profiles);
    useEffect(() => {
        dispatch(fetchProfiles());
    }, []);

    const changeActiveProfile = (profile) => {
        if (profile.length === 0) return;
        console.log(profile)
        dispatch(fetchEvents(profile[profile.length - 1]));
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
                <TypeHead profiles={profiles} selectedValues={[activeProfile]} setSelectedValues={changeActiveProfile}/>
            </div>
        </div>
        <div className={pageStyle.body}>
                <>
                <EventForm ref={eventFormRef}/>
                <Events ref={eventListRef}/>
                </>
        </div>
    </div>
    </div>
  );
}
