import { configureStore } from '@reduxjs/toolkit'
import pasteReducer, { pasteSlice } from './redux/pasteSlice'

export default configureStore({
  reducer: {
    paste: pasteReducer,
  },

})