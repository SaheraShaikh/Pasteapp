import { createSlice } from "@reduxjs/toolkit";
function loadPastes() {
  try {
    const data = JSON.parse(localStorage.getItem("pastes") || "[]");
    return Array.isArray(data)
      ? data.filter(
          (p) =>
            p &&
            typeof p._id === "string" &&
            typeof p.title === "string" &&
            typeof p.content === "string",
        )
      : [];
  } catch {
    return [];
  }
}
const slice = createSlice({
  name: "paste",
  initialState: { pastes: loadPastes() },
  reducers: {
    addToPastes: (s, { payload }) => {
      s.pastes.unshift(payload);
    },
    updateToPastes: (s, { payload }) => {
      const i = s.pastes.findIndex((p) => p._id === payload._id);
      if (i >= 0) s.pastes[i] = { ...s.pastes[i], ...payload };
    },
    removeFromPastes: (s, { payload }) => {
      s.pastes = s.pastes.filter((p) => p._id !== payload);
    },
    resetAllPastes: (s) => {
      s.pastes = [];
    },
  },
});
export const { addToPastes, updateToPastes, removeFromPastes, resetAllPastes } =
  slice.actions;
export default slice.reducer;
