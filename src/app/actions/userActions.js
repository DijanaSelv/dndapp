import { uiSliceActions } from "../uiSlice";
import { userSliceActions } from "../userSlice";
import { createNewUserData } from "./databaseActions";
//import { getUserData } from "./databaseActions";
import { auth } from "./base";

//firebase imports
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  //onAuthStateChanged,
  signOut,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";

//TODO: what if when they sign up, the auth projdva a ova fialnuva. Posle kje nema data za toj user. Maybe on login, if they can log in but can't access the data, just to be safe, the data is created then?
//try to get the home page data, and if it doesn't work create it.
//maybe if it doesn't work even then, display some page that app doesn't work try again later?

/* export const loggedInUser = () => {
  return async (dispatch) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userSliceActions.setLoggedInUser(user.uid));
        dispatch(getUserData(user.uid));
      }
    });

    return () => unsubscribe(); // Return the unsubscribe function
  };
}; */

//sign up new user (create new user data in collection)
export const signUpUserAction = (user, password) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));

    let uid;
    let userCredential;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        password
      );
      dispatch(signOutUser());
      uid = userCredential.user.uid;
      await dispatch(createNewUserData(uid, user));
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "sign up success",
        })
      );
      dispatch(uiSliceActions.requestSuccessIsTrue());
    } catch (error) {
      dispatch(uiSliceActions.requestFailedIsTrue());
      console.error("Firebase Auth Error", error.code, error.message);
      console.log("usercredential", userCredential);
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: error.code,
        })
      );
    }
    dispatch(uiSliceActions.changeLoading(false));
  };
};

//log in existing user (get data to display on home page)
export const loginUserAction = (email, password) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      //console.log(rememberMe, auth);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(uiSliceActions.requestSuccessIsTrue());
      const user = userCredential.user;
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "log in success",
        })
      );
      //dispatch(userSliceActions.setLoggedInUser(user.uid));
      //dispatch(getUserData(user.uid));
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: errorCode,
        })
      );
      dispatch(uiSliceActions.requestFailedIsTrue());
    }
    dispatch(uiSliceActions.changeLoading(false));
  };
};

export const signOutUser = () => {
  return async (dispatch) => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      dispatch(userSliceActions.setSignOutUser());
    } catch (error) {
      console.log("error during sign out", error);
    }
  };
};

//set persistence before login
export const persistenceChange = (rememberMe) => {
  return async (dispatch) => {
    setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
    // console.log("persistence changed", auth);
  };
};
