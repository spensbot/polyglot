import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  count: 0
}

export const appSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setCount
} = appSlice.actions

export default appSlice.reducer