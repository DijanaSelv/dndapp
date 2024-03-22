import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: {},
};

const notesSlice = createSlice({
  name: "shonoetsps",
  initialState,
  reducers: {
    setNotesData(state, action) {
      state.notes = action.payload;
    },
  },
});

export const notesSliceActions = notesSlice.actions;

export default notesSlice.reducer;
