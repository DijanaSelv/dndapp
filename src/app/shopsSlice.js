import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shops: {},
};

const shopsSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setShopsData(state, action) {
      state.shops = action.payload;
    },
  },
});

export const shopsSliceActions = shopsSlice.actions;

export default shopsSlice.reducer;
