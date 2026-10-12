import { configureStore } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import pasteReducer from "./redux/pasteSlice";
const store = configureStore({ reducer: { paste: pasteReducer } });
store.subscribe(() => {
  try {
    localStorage.setItem(
      "pastes",
      JSON.stringify(store.getState().paste.pastes),
    );
  } catch {
    toast.error(
      "Browser storage is full or unavailable. Changes may not survive a reload.",
      { id: "storage-error" },
    );
  }
});
export default store;
