import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  activeProfile: "",
  profiles: [],
  toast: {
    message: "",
    type: "",
  }
}

export const createProfile = createAsyncThunk('profiles/createProfile', async (profileName,{rejectWithValue}) => {
    if (profileName === "") {
        return rejectWithValue("Profile name is required")
    }
    const response = await fetch(`/api/profiles/addProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name:profileName }),
    })
    const data = await response.json()
    return data.profile
})

export const fetchProfiles = createAsyncThunk('profiles/getProfiles', async (profileName='',thunkAPI) => {
  try {
    const response = await fetch(`/api/profiles/getProfiles?name=${profileName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      return thunkAPI.rejectWithValue({ message: 'Failed to fetch profiles' })
    }
    const data = await response.json()
    return data.profiles
  } catch (error) {
    return thunkAPI.rejectWithValue({message: 'error fetching profiles'})
  }
})

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setActiveProfile: (state, action) => {
      state.activeProfile = action.payload
    },
    setToast: (state, action) => {
      state.toast = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createProfile.fulfilled, (state, action) => {
      if (state.profiles.length === 0) {
        state.activeProfile = action.payload
      }
      state.profiles.push(action.payload)
      state.toast = {
        message: "Profile created successfully",
        type: "success",
      }
    })
    builder.addCase(fetchProfiles.fulfilled,(state,action)=>{
      state.profiles = action.payload
    })
    .addCase(fetchProfiles.rejected,(state,action)=>{
      state.toast = {
        message: action.payload.message,
        type: "error",
      }
    })
    builder.addCase(createProfile.rejected,(state,action)=>{
        state.toast = {
            message: action.payload,
            type: "error",
        }
    })
  }
})

export const profilesActions = profilesSlice.actions
