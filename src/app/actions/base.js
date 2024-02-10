import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYbIIDWCSgyH1iiIpiYc-3lPzEKdCrBEM",
  authDomain: "project1-39992.firebaseapp.com",
  databaseURL: "https://project1-39992-default-rtdb.firebaseio.com",
  projectId: "project1-39992",
  storageBucket: "project1-39992.appspot.com",
  messagingSenderId: "743450625278",
  appId: "1:743450625278:web:7c2d663e9c9d4e2ee851af",
};
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
