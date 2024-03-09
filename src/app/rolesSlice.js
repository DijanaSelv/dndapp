import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dm: false,
  player: false,
  creator: false,
  loremaster: false,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles(state, action) {
      const {
        dm = false,
        player = false,
        creator = false,
        logmaster = false,
      } = action.payload;
      state.dm = dm;
      state.player = player;
      state.creator = creator;
      state.loremaster = logmaster;
    },
    resetRoles(state) {
      return initialState;
    },
  },
});

export const rolesSliceActions = rolesSlice.actions;

export default rolesSlice.reducer;
