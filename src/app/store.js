//import { combineReducers } from "@reduxjs/toolkit";

//reducers
import userSliceReducer from "./userSlice";
import uiSliceReducer from "./uiSlice";
import campaignSliceReducer from "./campaignSlice";
import shopsSliceReducer from "./shopsSlice";
import { configureStore } from "@reduxjs/toolkit";
import rolesSlice from "./rolesSlice";

/* export const rootReducer = combineReducers({
  userSlice: userSliceReducer,
  uiSlice: uiSliceReducer,
  campaignSlice: campaignSliceReducer,
  shopsSlice: shopsSliceReducer,
}); */

/* export const store = createStore(rootReducer); */

export const store = configureStore({
  reducer: {
    userSlice: userSliceReducer,
    uiSlice: uiSliceReducer,
    campaignSlice: campaignSliceReducer,
    shopsSlice: shopsSliceReducer,
    rolesSlice: rolesSlice,
  },
  /*  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }), */
});
