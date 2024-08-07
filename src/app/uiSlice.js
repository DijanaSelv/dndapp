import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: null,
  requestSuccess: false,
  requestFailed: false,
  isLoading: true,
  userChecked: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showNotification(state, action) {
      let message;
      let description;

      // TODO use switch case instead
      //add more if needed for sign in primer or other scenarios
      if (action.payload.code === "auth/email-already-in-use") {
        message = "Error";
        description = "Email already in use.";
      } else if (action.payload.code === "auth/invalid-email") {
        message = "Error";
        description = "Email is not valid.";
      } else if (action.payload.code === "auth/invalid-password") {
        message = "Error";
        description = "Password is invalid.";
      } else if (action.payload.code === "auth/invalid-credential") {
        message = "Error";
        description = "Wrong email or password.";
      } else if (action.payload.code === "sign up success") {
        message = "Done";
        description = "Sign up successful!";
      } else if (action.payload.code === "log in success") {
        message = "Done";
        description = "Log in successful!";
      } else if (action.payload.code === "new campaign created") {
        message = "Done";
        description = "Campaign created";
      } else if (action.payload.code === "new shop created") {
        message = "Done";
        description = "Shop created";
      } else if (action.payload.code === "campaign deleted") {
        message = "Done";
        description = "Campaign deleted";
      } else if (action.payload.code === "shop deleted") {
        message = "Done";
        description = "Shop deleted";
      } else if (action.payload.code === "shop updated") {
        message = "Done";
        description = "Shop updated!";
      } else if (action.payload.code === "no join campaign") {
        message = "Error";
        description = "There is no campaign with that code";
      } else if (action.payload.code === "campaign joined") {
        message = "Joined";
        description = "You joined a new campaign!";
      } else if (action.payload.code === "already joined") {
        message = "Already joined";
        description = "You're already a member of this campaign.";
      } else if (action.payload.code === "campaign left") {
        message = "Campaign left";
        description = "You left the campaign.";
      } else if (action.payload.code === "added character") {
        message = "Character added";
        description = "You added a character to this campaign.";
      } else if (action.payload.code === "removed character") {
        message = "Character removed";
        description = "You removed your character from this campaign.";
      } else {
        message = "Error";
        description = "Request failed. Try again later.";
      }

      state.notification = {
        type: action.payload.type,
        message,
        description,
      };
    },
    requestSuccessIsTrue(state) {
      state.requestSuccess = true;
    },
    requestFailedIsTrue(state) {
      state.requestFailed = true;
    },
    /*     thereIsInputTrue(state) {
      state.thereIsInput = true;
    },
    resetThereIsInput(state) {
      state.thereIsInput = false;
    }, */
    resetRequestState(state) {
      state.notification = null;
      state.requestSuccess = false;
      state.requestFailed = false;
    },

    changeLoading(state, action) {
      state.isLoading = action.payload;
    },

    setUserChecked(state) {
      state.userChecked = true;
    },
  },
});

export const uiSliceActions = uiSlice.actions;

export default uiSlice.reducer;
