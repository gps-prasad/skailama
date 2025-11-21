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
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/addEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    const data = await response.json()
    if (data.error) {
      thunkAPI.dispatch(profilesActions.setToast({ message: JSON.stringify(data.error.message), type: "error" }))
      return data.error
    }
    thunkAPI.dispatch(profilesActions.setToast({ message: "Event created successfully", type: "success" }))
    return data.event
})

export const fetchEventLogs = createAsyncThunk('events/getEventLogs', async (eventId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/logs/${eventId}`, {
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
    builder.addCase(fetchEventLogs.fulfilled,(state,action)=>{
      state.eventLogs = action.payload
    })
  }
})

export const eventsActions = eventsSlice.actions
