import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  characters: {},
};

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setCharactersData(state, action) {
      state.characters = action.payload;
    },
  },
});

export const charactersSliceActions = charactersSlice.actions;
export default charactersSlice.reducer;
