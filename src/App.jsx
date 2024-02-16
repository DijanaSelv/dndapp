import React, { useEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import ErrorPage from "./pages/errorpage/Error";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homepage/HomePage";
import SignupPage from "./pages/signuppage/SignupPage";
import CampaignInfoPage from "./pages/campaigninfopage/CampaignInfoPage";
import CampaignPlayPage from "./pages/campaignplaypage/CampaignPlayPage";
import NewCampaignPage from "./pages/newcampaignpage/NewCampaignPage";
import NewCharacterPage from "./pages/newcharacterpage/NewCharacterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { auth } from "./app/actions/base";
import { userSliceActions } from "./app/userSlice";
import { getUserData } from "./app/actions/databaseActions";
import { onAuthStateChanged } from "firebase/auth";
import LoggedInRoute from "./components/LoggedInRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Login",
        element: (
          <LoggedInRoute>
            <LoginPage />
          </LoggedInRoute>
        ),
      },
      { path: "/Signup", element: <SignupPage /> },
      {
        path: "/NewCampaign",
        element: (
          <ProtectedRoute>
            <NewCampaignPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/NewCharacter",
        element: (
          <ProtectedRoute>
            <NewCharacterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Campaigns",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/info",
        element: (
          <ProtectedRoute>
            <CampaignInfoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Campaigns/:type/:campaignId/play",
        element: (
          <ProtectedRoute>
            <CampaignPlayPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  console.log("app component");

  useEffect(() => {
    console.log("app effect");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userSliceActions.setLoggedInUser(user.uid));
        dispatch(getUserData(user.uid));
      }
    });

    return () => unsubscribe();
  }, []);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
