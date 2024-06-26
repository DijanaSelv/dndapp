import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: {
    uid: null,
    email: null,
    firstName: null,
    lastName: null,
    campaigns: {
      created: undefined,
      joined: undefined,
    },
    characters: {},
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
      //null distinguishes from undefined, means data has been fetched but is empty vs undefined might still be loading (on home page campaign cards container)
      state.user.campaigns.created = action.payload.campaigns?.created || null;
      state.user.campaigns.joined = action.payload.campaigns?.joined || null;
      state.user.characters = action.payload.characters || null;
    },
    setSignOutUser() {
      return initialState;
    },
    updateUserCampaigns(state, action) {
      state.user.campaigns.created = action.payload.created || null;
      state.user.campaigns.joined = action.payload.joined || null;
    },
    updateCharacters(state, action) {
      state.user.characters = action.payload || null;
    },
  },
});

export const userSliceActions = userSlice.actions;

export default userSlice.reducer;
