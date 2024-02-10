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
      { path: "/Login", element: <LoginPage /> },
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
        path: "Campaigns/:type/:campaignId/info",
        element: (
          <ProtectedRoute>
            <ProtectedRoute>
              <CampaignInfoPage />
            </ProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "Campaigns/:type/:campaignId/play",
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

  useEffect(() => {
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
