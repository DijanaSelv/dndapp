import { configureStore } from "@reduxjs/toolkit";

//reducers
import userSliceReducer from "./userSlice";
import uiSliceReducer from "./uiSlice";
import campaignSliceReducer from "./campaignSlice";
import shopsSliceReducer from "./shopsSlice";

export const store = configureStore({
  reducer: {
    userSlice: userSliceReducer,
    uiSlice: uiSliceReducer,
    campaignSlice: campaignSliceReducer,
    shopsSlice: shopsSliceReducer,
  },
});
