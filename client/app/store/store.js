import { configureStore } from '@reduxjs/toolkit'
import { profilesSlice } from './features/profilesSlice'
import { eventsSlice } from './features/eventsSlice'

export const store = configureStore({
  reducer: {
    profiles: profilesSlice.reducer,
    events: eventsSlice.reducer,
  },
})