import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

//reducers
import userSliceReducer from "./userSlice";
import uiSliceReducer from "./uiSlice";
import campaignSliceReducer from "./campaignSlice";
import shopsSliceReducer from "./shopsSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

export const rootReducer = combineReducers({
  userSlice: userSliceReducer,
  uiSlice: uiSliceReducer,
  campaignSlice: campaignSliceReducer,
  shopsSlice: shopsSliceReducer,
});

/* export const store = createStore(rootReducer); */

/* export const store = configureStore({
  reducer: {
    userSlice: userSliceReducer,
    uiSlice: uiSliceReducer,
    campaignSlice: campaignSliceReducer,
    shopsSlice: shopsSliceReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
}); */
