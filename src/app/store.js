import { configureStore } from "@reduxjs/toolkit";

//reducers
import userSliceReducer from "./userSlice";
import uiSliceReducer from "./uiSlice";
import campaignSliceReducer from "./campaignSlice";

/* const rootReducer = {
  counter: counterReducer,

  userReducer,

  // Add other reducers here if needed
}; */

export const store = configureStore({
  reducer: { userSliceReducer, uiSliceReducer, campaignSliceReducer },

  // Add middleware or other configuration options if needed
});
