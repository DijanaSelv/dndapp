import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { rootReducer } from "./store";
import { applyMiddleware } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

//I created the store with this in order to keep state persistence on page refresh.
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
