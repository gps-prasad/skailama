import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {profilesActions} from './profilesSlice'

const initialState = {
    profiles: [],
    events: [],
    timezone: "UTC",
    eventLogs: [],
    editEvent: {
      profiles: [],
      timezone: "UTC",
      eventStartDate: "",
      eventEndDate: ""
    }
}

export const createEvents = createAsyncThunk('events/createEvents', async (event,thunkAPI) => {
    const response = await fetch('http://localhost:3001/api/events/addEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    const data = await response.json()
    if (data.error) {
      thunkAPI.dispatch(profilesActions.setToast({ message: data.error, type: "error" }))
      return data.error
    }
    thunkAPI.dispatch(profilesActions.setToast({ message: "Event created successfully", type: "success" }))
    return data.event
})

export const updateEvent = createAsyncThunk('events/updateEvent', async (event) => {
    const response = await fetch('http://localhost:3001/api/events/updateEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    const data = await response.json()
    return data.event
})

export const fetchEvents = createAsyncThunk('events/getEvents', async (activeProfile,thunkAPI) => {
    const response = await fetch('http://localhost:3001/api/events/' + activeProfile, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (data.status === false) {
      console.log(data.message)
      thunkAPI.dispatch(profilesActions.setToast({ message: data.message, type: "error" }))
      return
    }
    if (data.event.length === 0) {
      thunkAPI.dispatch(profilesActions.setToast({ message: "No events found", type: "warning" }))
      return
    }
    thunkAPI.dispatch(profilesActions.setToast({ message: data.message, type: "success" }))
    return data.event
})

export const fetchEvent = createAsyncThunk('events/getEvent', async (eventId,thunkAPI) => {
    const response = await fetch('http://localhost:3001/api/events/event/' + eventId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    return data.event
})

export const fetchEventLogs = createAsyncThunk('events/getEventLogs', async (eventId) => {
  console.log('http://localhost:3001/api/logs/' + eventId)
  const response = await fetch('http://localhost:3001/api/logs/' + eventId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  return data.logs.logs
})

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setTimezone(state, action) {
      state.timezone = action.payload;
    },
    updateEvent(state, action) {
      state.editEvent = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEvents.fulfilled,(state,action)=>{
      console.log(action.payload)
      state.events = action.payload
    })
    builder.addCase(fetchEvent.fulfilled,(state,action)=>{
      state.editEvent = action.payload
    })
    builder.addCase(createEvents.fulfilled,(state,action)=>{

    })
    builder.addCase(fetchEventLogs.fulfilled,(state,action)=>{
      state.eventLogs = action.payload
    })
  }
})

export const eventsActions = eventsSlice.actions
