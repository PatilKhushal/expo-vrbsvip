import { configureStore } from '@reduxjs/toolkit'
import configurationsReducer from '@/reducers/configurations'

export const store = configureStore({
  reducer: {
    configurations : configurationsReducer
  },
})