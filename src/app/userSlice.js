import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: {
    uid: null,
    email: null,
    firstName: null,
    lastName: null,
    campaigns: [],
    characters: [],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedInUser(state, action) {
      state.isLoggedIn = true;
      state.user.uid = action.payload;
    },
    setUserData(state, action) {
      state.user.firstName = action.payload.firstName;
      state.user.lastName = action.payload.lastName;
      state.user.email = action.payload.email;
      state.user.campaigns = action.payload.campaigns;
    },
    setSignOutUser(state) {
      // ! remove the state since its not used
      return initialState;
    },
  },
});

export const userSliceActions = userSlice.actions;

export default userSlice.reducer;
